import React, { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { FLAG_QUESTIONS } from './constants';
import { AnswerState, QuizMode, Difficulty, FlagQuestion } from './types';
import { trackEvent } from './analytics';
import AdBanner from './AdBanner';
import AffiliateCard from './AffiliateCard';

interface QuizPageProps {
  goToHome: () => void;
}

const QuizPage: React.FC<QuizPageProps> = ({ goToHome }) => {
  // Setup State
  const [isPlaying, setIsPlaying] = useState(false);
  const [quizMode, setQuizMode] = useState<QuizMode>('flag-to-country');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [isLoading, setIsLoading] = useState(false);
  
  // Game State
  const [questions, setQuestions] = useState<FlagQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>(AnswerState.IDLE);
  const [isFinished, setIsFinished] = useState(false);
  const [funFacts, setFunFacts] = useState<Record<string, string>>({});
  const [isFetchingFact, setIsFetchingFact] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  // --- Logic: Generate Quiz ---
  const generateQuiz = async () => {
    setIsLoading(true);
    
    try {
      if (quizMode === 'flag-to-country') {
        // Use local data for flags to ensure images load fast and reliably
        // Shuffle and slice for variety
        const shuffled = [...FLAG_QUESTIONS].sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, 10)); // 10 questions for flags
      } else {
        // Use GenAI for Capital or Continent quizzes
        const apiKey = process.env.API_KEY;
        if (!apiKey) throw new Error("API Key missing");

        const ai = new GoogleGenAI({ apiKey });
        
        let prompt = "";
        if (quizMode === 'country-to-capital') {
            prompt = `Generate 5 multiple-choice questions. The user is given a Country, and must guess the Capital City. Difficulty: ${difficulty}.`;
        } else if (quizMode === 'country-to-continent') {
            prompt = `Generate 5 multiple-choice questions. The user is given a Country, and must guess which Continent it is in. Difficulty: ${difficulty}.`;
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            questionText: { type: Type.STRING, description: "The question, e.g., 'What is the capital of France?'" },
                            options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 possible answers" },
                            correctAnswer: { type: Type.STRING, description: "The correct answer from the options" }
                        },
                        required: ["questionText", "options", "correctAnswer"]
                    }
                }
            }
        });

        const generatedQuestions = JSON.parse(response.text);
        if (generatedQuestions && generatedQuestions.length > 0) {
            setQuestions(generatedQuestions);
        } else {
            throw new Error("No questions generated");
        }
      }
      
      setIsPlaying(true);
      trackEvent('quiz_started', { mode: quizMode, difficulty });
    } catch (e) {
      console.error(e);
      alert("Could not generate quiz. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Logic: Fetch Fun Fact ---
  const fetchFunFact = useCallback(async (answer: string) => {
    if (funFacts[answer]) return;
    setIsFetchingFact(true);
    
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) return;
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Tell me a 1-sentence interesting fact about ${answer}.`
      });
      setFunFacts(prev => ({ ...prev, [answer]: response.text }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetchingFact(false);
    }
  }, [funFacts]);

  // --- Logic: Gameplay ---
  const handleAnswerClick = (option: string) => {
    if (answerState !== AnswerState.IDLE) return;
    setSelectedAnswer(option);
    
    const isCorrect = option === currentQuestion.correctAnswer;
    if (isCorrect) {
      setAnswerState(AnswerState.CORRECT);
      setScore(prev => prev + 1);
    } else {
      setAnswerState(AnswerState.INCORRECT);
    }

    // Determine what subject to fetch the fact about
    // If it's a flag quiz, correct answer is Country.
    // If capital quiz, correct answer is Capital.
    fetchFunFact(currentQuestion.correctAnswer);
  };

  const handleNextQuestion = useCallback(() => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setAnswerState(AnswerState.IDLE);
    } else {
      setIsFinished(true);
      trackEvent('quiz_complete', { score, mode: quizMode });
    }
  }, [currentQuestionIndex, questions.length, score, quizMode]);

  const restartGame = () => {
    setIsPlaying(false);
    setIsFinished(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuestions([]);
    setSelectedAnswer(null);
    setAnswerState(AnswerState.IDLE);
  };

  const getButtonClass = (option: string) => {
    if (answerState === AnswerState.IDLE) return 'bg-white hover:bg-indigo-50 border-gray-200 text-gray-700';
    if (option === currentQuestion.correctAnswer) return 'bg-green-500 text-white border-green-600 shadow-md transform scale-[1.02]';
    if (option === selectedAnswer) return 'bg-red-500 text-white border-red-600';
    return 'bg-gray-100 text-gray-400 border-gray-200';
  };

  // --- Render: Setup Screen ---
  if (!isPlaying) {
    return (
        <div className="w-full bg-white rounded-3xl shadow-xl p-6 md:p-8 animate-fade-in-up">
            <button onClick={goToHome} className="mb-6 text-gray-500 hover:text-indigo-600 font-medium flex items-center">
             ← Back
            </button>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Quiz Setup</h2>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Game Mode</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {(['flag-to-country', 'country-to-capital', 'country-to-continent'] as QuizMode[]).map(m => (
                            <button
                                key={m}
                                onClick={() => setQuizMode(m)}
                                className={`p-4 rounded-xl border-2 text-sm font-bold transition-all ${quizMode === m ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                            >
                                {m === 'flag-to-country' ? '🏳️ Name the Flag' : m === 'country-to-capital' ? '🏙️ Name Capital' : '🌍 Name Continent'}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Difficulty</label>
                    <div className="flex gap-3">
                        {(['beginner', 'intermediate', 'expert'] as Difficulty[]).map(d => (
                            <button
                                key={d}
                                onClick={() => setDifficulty(d)}
                                className={`flex-1 p-3 rounded-xl border-2 text-sm font-bold capitalize transition-all ${difficulty === d ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={generateQuiz}
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                >
                    {isLoading ? 'Generating Questions...' : 'Start Quiz'}
                </button>
            </div>
            
            <div className="mt-8">
                <AdBanner />
            </div>
        </div>
    );
  }

  // --- Render: Results Screen ---
  if (isFinished) {
    return (
      <div className="w-full bg-white rounded-3xl shadow-xl p-8 text-center animate-fade-in-up">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
        <div className="text-6xl font-black text-indigo-600 mb-4">{score} / {questions.length}</div>
        <p className="text-gray-600 mb-8">
          {score === questions.length ? "Perfect Score! You're a geography genius!" : "Great effort! Keep practicing to become an expert."}
        </p>
        
        <button
          onClick={restartGame}
          className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-indigo-700 transition-transform active:scale-95 mb-4"
        >
          Play Again
        </button>
        <button
            onClick={goToHome}
            className="w-full bg-gray-100 text-gray-700 font-bold py-4 px-6 rounded-xl hover:bg-gray-200 transition-transform active:scale-95"
        >
            Back to Home
        </button>
        <div className="mt-8">
            <AffiliateCard />
        </div>
      </div>
    );
  }

  // --- Render: Question Screen ---
  return (
    <div className="w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[600px]">
      {/* Header */}
      <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
        <span className="font-bold text-gray-500 text-sm">Question {currentQuestionIndex + 1} / {questions.length}</span>
        <span className="font-bold text-indigo-600 text-lg">Score: {score}</span>
      </div>

      <div className="p-6 md:p-8 flex-grow flex flex-col">
        {/* Question Content */}
        <div className="mb-6 text-center">
            {currentQuestion.flagUrl ? (
                <div className="relative inline-block shadow-lg rounded-lg overflow-hidden">
                     <img
                        src={currentQuestion.flagUrl}
                        alt="Flag"
                        className="h-40 md:h-56 object-contain bg-gray-100"
                    />
                </div>
            ) : (
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                    {currentQuestion.questionText}
                </h3>
            )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswerClick(option)}
              disabled={answerState !== AnswerState.IDLE}
              className={`p-4 rounded-xl border-2 text-lg font-medium transition-all duration-200 outline-none focus:ring-4 ring-indigo-100 ${getButtonClass(option)}`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Feedback / Next */}
        {answerState !== AnswerState.IDLE && (
            <div className="animate-fade-in-up mt-auto">
                <div className={`p-4 rounded-xl mb-4 ${answerState === AnswerState.CORRECT ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <p className="font-bold text-lg mb-1">
                        {answerState === AnswerState.CORRECT ? "🎉 Correct!" : `❌ Correct answer: ${currentQuestion.correctAnswer}`}
                    </p>
                    <div className="text-sm opacity-90 mt-2">
                        {isFetchingFact ? (
                            <span className="animate-pulse">Loading fun fact...</span>
                        ) : (
                            <p>💡 {funFacts[currentQuestion.correctAnswer]}</p>
                        )}
                    </div>
                </div>
                <button
                    onClick={handleNextQuestion}
                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                >
                    Next Question →
                </button>
            </div>
        )}

        {/* Ad Placeholder (Only show if still answering to avoid cluttering feedback) */}
        {answerState === AnswerState.IDLE && (
            <div className="mt-auto pt-4 opacity-50">
                <AdBanner />
            </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;