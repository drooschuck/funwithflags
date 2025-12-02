import React, { useState } from 'react';
import HomePage from './HomePage';
import QuizPage from './QuizPage';
import FactsPage from './FactsPage';
import PremiumPage from './PremiumPage';
import Footer from './Footer';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigateTo = (page: Page) => setCurrentPage(page);

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
    <div className="bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen flex flex-col items-center justify-center p-4 font-sans text-gray-800">
      <div className="w-full flex flex-col items-center justify-center min-h-screen">
        <main className="w-full flex-grow flex flex-col items-center justify-center p-4">
          {renderPage()}
        </main>
        <Footer goToPremium={() => navigateTo('premium')} />
      </div>
    </div>
  );
};

export default App;