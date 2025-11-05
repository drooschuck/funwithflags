import React from 'react';
import { trackEvent } from './analytics';

interface PremiumPageProps {
  goToHome: () => void;
}

const PremiumPage: React.FC<PremiumPageProps> = ({ goToHome }) => {

  const handleUpgradeClick = () => {
    trackEvent('click_upgrade_checkout', {
      category: 'Monetization',
      label: 'Stripe Checkout Button'
    });
    // Here you would integrate with Stripe Checkout.
    // For now, it's a placeholder.
    alert("Stripe Checkout integration goes here!");
  };

  return (
    <>
      <div className="w-full max-w-md">
        <button onClick={goToHome} className="mb-4 text-indigo-600 hover:text-indigo-800 font-semibold">
          &larr; Back to Home
        </button>
      </div>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Go Premium!</h1>
        <p className="text-lg text-gray-600 mb-6">
          Go Ad-Free and Unlock More Quizzes!
        </p>

        <ul className="text-left space-y-3 text-gray-700 mb-8">
          <li className="flex items-center">
            <span className="text-green-500 mr-3">✔</span>
            <span>Enjoy a completely ad-free experience.</span>
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-3">✔</span>
            <span>Access exclusive quiz types and categories.</span>
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-3">✔</span>
            <span>Track your progress and stats over time.</span>
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-3">✔</span>
            <span>Directly support the development of this app.</span>
          </li>
        </ul>

        <button
          onClick={handleUpgradeClick}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          Upgrade Now
        </button>
      </div>
    </>
  );
};

export default PremiumPage;
