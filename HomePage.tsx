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
    <div className="text-center flex flex-col items-center justify-center py-8">
      <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6 animate-fade-in-down tracking-tight">
        Fun with Flags
      </h1>
      
      <div className="w-full bg-white rounded-3xl shadow-xl p-8 transform transition-transform duration-500 hover:shadow-2xl mb-8 border border-white/50 backdrop-blur-sm">
        <div className="space-y-6">
            <p className="text-xl text-gray-700 leading-relaxed">
              Explore the world! Test your geography skills or dive deep into the history behind the flags.
            </p>
            
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={handleStartQuiz}
                className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-indigo-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-200"
              >
                🎮 Play Quiz
              </button>
              <button
                onClick={showFacts}
                className="w-full bg-purple-100 text-purple-700 font-bold py-4 px-6 rounded-xl hover:bg-purple-200 transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
              >
                🌍 Explore Country Facts
              </button>
            </div>
        </div>
      </div>

      <div className="w-full space-y-6">
        <AdBanner />
        <AffiliateCard />
      </div>
    </div>
  );
};

export default HomePage;