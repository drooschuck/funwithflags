import React from 'react';
import { trackEvent } from './analytics';
import AdBanner from './AdBanner';
import AffiliateCard from './AffiliateCard';

interface HomePageProps {
  startQuiz: () => void;
  showFacts: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ startQuiz, showFacts }) => {

  const handleStartQuiz = () => {
    trackEvent('quiz_start', {
      category: 'Quiz',
      label: 'Start Quiz From Home'
    });
    startQuiz();
  };

  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-8 animate-fade-in-down">Fun with Flags</h1>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 transform transition-transform duration-500 hover:scale-105">
        <div className="space-y-4">
            <p className="text-lg text-gray-600">Welcome to the <span className="font-bold text-indigo-600">Ultimate Flag Quiz</span>!</p>
            <p className="text-gray-600">Test your knowledge or learn something new about the world's flags and countries.</p>
            <button
            onClick={handleStartQuiz}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
            Start Quiz
            </button>
            <button
            onClick={showFacts}
            className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
            Explore Country Facts
            </button>
        </div>
      </div>
      <div className="mt-8 w-full max-w-sm space-y-4">
        <AffiliateCard />
        <AdBanner />
      </div>
    </div>
  );
};

export default HomePage;