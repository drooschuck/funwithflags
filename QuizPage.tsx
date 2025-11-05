import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { supabase } from './supabaseClient';
import { FLAG_QUESTIONS } from './constants';
import { AnswerState } from './types';

interface QuizPageProps {
  goToHome: () => void;
}

const QuizPage: React.FC<QuizPageProps> = ({ goToHome }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>(AnswerState.IDLE);
  const [isFinished, setIsFinished] = useState(false);
  const [funFacts, setFunFacts] = useState<Record<string, string>>({});
  const [isFetchingFact, setIsFetchingFact] = useState(false);

  const currentQuestion = FLAG_QUESTIONS[currentQuestionIndex];

  const fetchFunFact = useCallback(async (countryName: string) => {
    if (funFacts[countryName]) {
      return; 
    }
    setIsFetchingFact(true);
    
    try {
      // 1. Check database first
      const { data: country, error: dbError } = await supabase
        .from('countries')
        .select('fun_fact')
        .eq('name', countryName)
        .single();

      if (dbError && dbError.code !== 'PGRST116') { // PGRST116: 'exact one row not found'
          throw dbError;
      }

      if (country && country.fun_fact) {
        setFunFacts(prev => ({ ...prev, [countryName]: country.fun_fact as string }));
        return;
      }

      // 2. If not in DB, fetch from Gemini API
      const apiKey = process.env.API_KEY;
      if (!apiKey || apiKey === "undefined") {
        throw new Error("Gemini API key is missing or not configured.");
      }
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Tell me a fun and interesting fact about ${countryName}. Keep it concise and engaging, under 200 characters.`
      });
      const fact = response.text;
      setFunFacts(prevFacts => ({ ...prevFacts, [countryName]: fact }));
      
      // 3. Store new fact in the database
      const { error: upsertError } = await supabase
        .from('countries')
        .upsert({ name: countryName, fun_fact: fact }, { onConflict: 'name' });
      
      if (upsertError) {
        console.error("Error saving fun fact to DB:", upsertError);
      }

    } catch (error: any) {
      const errorMessage = error?.message || "An unknown error occurred.";
      console.error("Error fetching or processing fun fact:", errorMessage, error);
      setFunFacts(prevFacts => ({
        ...prevFacts,
        [countryName]: `Could not load a fun fact. ${errorMessage}`,
      }));
    } finally {
      setIsFetchingFact(false);
    }
  }, [funFacts]);


  const handleNextQuestion = useCallback(() => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < FLAG_QUESTIONS.length) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setAnswerState(AnswerState.IDLE);
    } else {
      setIsFinished(true);
    }
  }, [currentQuestionIndex]);

  const handleAnswerClick = (option: string) => {
    if (answerState !== AnswerState.IDLE) return;

    setSelectedAnswer(option);
    if (option === currentQuestion.correctAnswer) {
      setAnswerState(AnswerState.CORRECT);
      setScore(prev => prev + 1);
    } else {
      setAnswerState(AnswerState.INCORRECT);
    }
    fetchFunFact(currentQuestion.correctAnswer);
  };
  
  const restartGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setAnswerState(AnswerState.IDLE);
    setIsFinished(false);
    setFunFacts({});
  };

  const getButtonClass = (option: string) => {
    if (answerState === AnswerState.IDLE) {
      return 'bg-white hover:bg-gray-100 border-gray-200';
    }

    if (option === currentQuestion.correctAnswer) {
      return 'bg-green-500 text-white border-green-600 scale-105';
    }
    
    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
      return 'bg-red-500 text-white border-red-600';
    }

    return 'bg-white border-gray-200 opacity-70';
  };

  return (
    <>
      <div className="w-full max-w-md">
        <button onClick={goToHome} className="mb-4 text-indigo-600 hover:text-indigo-800 font-semibold">
          &larr; Back to Home
        </button>
      </div>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8 transform transition-transform duration-500">
        {isFinished ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
            <p className="text-xl text-gray-600 mb-6">
              You scored {score} out of {FLAG_QUESTIONS.length}!
            </p>
            <button
              onClick={restartGame}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              Play Again
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center text-gray-500 text-sm mb-6">
              <p className="font-medium">Score: <span className="text-lg font-bold text-indigo-600">{score}</span></p>
              <p className="font-medium">Question {currentQuestionIndex + 1} / {FLAG_QUESTIONS.length}</p>
            </div>
            <div className="mb-6">
              <img
                src={currentQuestion.flagUrl}
                alt="Country Flag"
                className="w-48 h-auto object-cover rounded-lg mx-auto shadow-lg border-2 border-gray-100"
              />
            </div>
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerClick(option)}
                  disabled={answerState !== AnswerState.IDLE}
                  className={`w-full text-left text-lg p-4 rounded-xl border-2 shadow-sm transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400 ${getButtonClass(option)}`}
                >
                  {option}
                </button>
              ))}
            </div>

            {answerState !== AnswerState.IDLE && (
              <div className="mt-6 text-center">
                {answerState === AnswerState.CORRECT && (
                  <p className="text-xl font-bold text-green-600">Bazinga! You got it right!</p>
                )}
                {answerState === AnswerState.INCORRECT && (
                  <p className="text-xl font-bold text-red-600">Oops! The correct answer was {currentQuestion.correctAnswer}.</p>
                )}

                <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200 min-h-[100px] flex items-center justify-center">
                  {isFetchingFact ? (
                    <p className="text-indigo-700 animate-pulse">Loading amazing fact...</p>
                  ) : (
                    <div>
                      <h3 className="font-bold text-indigo-800 mb-1">Did you know?</h3>
                      <p className="text-gray-700">{funFacts[currentQuestion.correctAnswer]}</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextQuestion}
                  className="mt-4 bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                >
                  Next Flag
                </button>
              </div>
            )}
          </>
        )}
      </div>
       <footer className="mt-8 text-center text-gray-500">
        <p>Built with React, Tailwind, and a love for geography.</p>
      </footer>
    </>
  );
};

export default QuizPage;