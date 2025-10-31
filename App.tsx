
import React, { useState, useCallback } from 'react';
import { FLAG_QUESTIONS } from './constants';
import { AnswerState } from './types';

const App: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>(AnswerState.IDLE);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = FLAG_QUESTIONS[currentQuestionIndex];

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
      setTimeout(() => {
        handleNextQuestion();
      }, 1500);
    } else {
      setAnswerState(AnswerState.INCORRECT);
      setTimeout(() => {
        handleNextQuestion();
      }, 1500);
    }
  };
  
  const restartGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setAnswerState(AnswerState.IDLE);
    setIsFinished(false);
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
    <div className="bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen flex flex-col items-center justify-center p-4 font-sans text-gray-800">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">Fun with Flags</h1>

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
             <div className="mt-6 text-center text-gray-500 text-sm">
                Question {currentQuestionIndex + 1} of {FLAG_QUESTIONS.length}
             </div>
          </>
        )}
      </div>
       <footer className="mt-8 text-center text-gray-500">
        <p>Built with React, Tailwind, and a love for geography.</p>
      </footer>
    </div>
  );
};

export default App;
