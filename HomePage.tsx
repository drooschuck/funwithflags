import React from 'react';

interface HomePageProps {
  startQuiz: () => void;
  showFacts: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ startQuiz, showFacts }) => {
  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-8 animate-fade-in-down">Fun with Flags</h1>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 space-y-4 transform transition-transform duration-500 hover:scale-105">
        <p className="text-lg text-gray-600">Welcome! Test your knowledge or learn something new about the world's flags and countries.</p>
        <button
          onClick={startQuiz}
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
       <footer className="mt-8 text-center text-gray-500">
        <p>An interactive geography experience. Dedicated to Y. Araho </p>
      </footer>
    </div>
  );
};

export default HomePage;
