import React, { useState } from 'react';
import HomePage from './HomePage';
import QuizPage from './QuizPage';
import FactsPage from './FactsPage';
import PremiumPage from './PremiumPage';
import Footer from './Footer';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigateTo = (page: Page) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'quiz':
        return <QuizPage goToHome={() => navigateTo('home')} />;
      case 'facts':
        return <FactsPage goToHome={() => navigateTo('home')} />;
      case 'premium':
        return <PremiumPage goToHome={() => navigateTo('home')} />;
      case 'home':
      default:
        return <HomePage 
                  startQuiz={() => navigateTo('quiz')} 
                  showFacts={() => navigateTo('facts')} 
                />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen flex flex-col items-center font-sans text-gray-800">
      <div className="w-full max-w-4xl flex flex-col min-h-screen shadow-2xl bg-white/50 md:bg-transparent">
        <main className="flex-grow flex flex-col p-4 md:p-6 w-full max-w-2xl mx-auto">
          {renderPage()}
        </main>
        <div className="p-4 md:p-6 w-full max-w-2xl mx-auto">
          <Footer goToPremium={() => navigateTo('premium')} />
        </div>
      </div>
    </div>
  );
};

export default App;