import React from 'react';
import { supabase } from './supabaseClient';

interface HomePageProps {
  startQuiz: () => void;
  showFacts: () => void;
  userEmail?: string;
}

const HomePage: React.FC<HomePageProps> = ({ startQuiz, showFacts, userEmail }) => {

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-8 animate-fade-in-down">Fun with Flags</h1>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 transform transition-transform duration-500 hover:scale-105">
        <div className="space-y-4">
            <p className="text-lg text-gray-600">Welcome, <span className="font-bold text-indigo-600">{userEmail}</span>!</p>
            <p className="text-gray-600">Test your knowledge or learn something new about the world's flags and countries.</p>
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
        <button
            onClick={handleSignOut}
            className="w-full mt-4 bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-all duration-300"
        >
            Sign Out
        </button>
      </div>
       <footer className="mt-8 text-center text-gray-500">
        <p>An interactive geography experience.</p>
      </footer>
    </div>
  );
};

export default HomePage;