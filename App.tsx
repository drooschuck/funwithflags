import React, { useState, useEffect } from 'react';
import HomePage from './HomePage';
import QuizPage from './QuizPage';
import FactsPage from './FactsPage';
import PremiumPage from './PremiumPage';
import Footer from './Footer';
import { supabase } from './supabaseClient';
import { Page } from './types';
import { FLAG_QUESTIONS } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  useEffect(() => {
    // Attempt to sync countries on mount, though RLS might block it if not configured for public access.
    syncCountriesWithDb();
  }, []);

  const syncCountriesWithDb = async () => {
      try {
        const { data: dbCountries, error: selectError } = await supabase.from('countries').select('name');
        
        if (selectError) throw selectError;

        const dbCountryNames = new Set((dbCountries ?? []).map(c => c.name));
        const appCountries = [...new Set(FLAG_QUESTIONS.map(q => q.correctAnswer))].map(name => {
            const question = FLAG_QUESTIONS.find(q => q.correctAnswer === name);
            return {
                name: name,
                flag_url: question!.flagUrl
            };
        });

        const countriesToInsert = appCountries.filter(c => !dbCountryNames.has(c.name));

        if (countriesToInsert.length > 0) {
            const { error: insertError } = await supabase.from('countries').insert(countriesToInsert);
            if (insertError) throw insertError;
            console.log(`${countriesToInsert.length} countries synced with the database.`);
        }
      } catch(error: any) {
          const errorMessage = error?.message || "An unknown error occurred.";
          console.error("Error syncing countries with DB:", errorMessage, error);
      }
  };

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