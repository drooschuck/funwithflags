import React, { useState } from 'react';
import HomePage from './HomePage';
import QuizPage from './QuizPage';
import FactsPage from './FactsPage';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'quiz':
        return <QuizPage goToHome={() => setCurrentPage('home')} />;
      case 'facts':
        return <FactsPage goToHome={() => setCurrentPage('home')} />;
      case 'home':
      default:
        return <HomePage startQuiz={() => setCurrentPage('quiz')} showFacts={() => setCurrentPage('facts')} />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen flex flex-col items-center justify-center p-4 font-sans text-gray-800">
      {renderPage()}
    </div>
  );
};

export default App;
