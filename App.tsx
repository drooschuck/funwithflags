import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import HomePage from './HomePage';
import QuizPage from './QuizPage';
import FactsPage from './FactsPage';
import AuthPage from './AuthPage';
import PremiumPage from './PremiumPage';
import Footer from './Footer';
import { supabase } from './supabaseClient';
import { Page } from './types';
import { FLAG_QUESTIONS } from './constants';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (_event === 'SIGNED_IN') {
          syncCountriesWithDb();
        }
      }
    );

    return () => subscription.unsubscribe();
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

  const renderAuthenticatedApp = () => {
    if (!session) return null;

    let pageComponent;
    switch (currentPage) {
      case 'quiz':
        pageComponent = <QuizPage goToHome={() => navigateTo('home')} />;
        break;
      case 'facts':
        pageComponent = <FactsPage goToHome={() => navigateTo('home')} />;
        break;
      case 'premium':
        pageComponent = <PremiumPage goToHome={() => navigateTo('home')} />;
        break;
      case 'home':
      default:
        pageComponent = <HomePage 
                          userEmail={session.user.email} 
                          startQuiz={() => navigateTo('quiz')} 
                          showFacts={() => navigateTo('facts')} 
                        />;
        break;
    }

    return (
      <div className="w-full flex flex-col items-center justify-center min-h-screen">
        <main className="w-full flex-grow flex flex-col items-center justify-center p-4">
          {pageComponent}
        </main>
        <Footer goToPremium={() => navigateTo('premium')} />
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen flex flex-col items-center justify-center p-4 font-sans text-gray-800">
      {session ? renderAuthenticatedApp() : <AuthPage />}
    </div>
  );
};

export default App;