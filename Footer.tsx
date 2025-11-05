import React from 'react';
import { trackEvent } from './analytics';

interface FooterProps {
  goToPremium: () => void;
}

const Footer: React.FC<FooterProps> = ({ goToPremium }) => {

  const handleSupportClick = () => {
    trackEvent('click_support_developer', {
      category: 'Monetization',
      label: 'BuyMeACoffee Button'
    });
  };

  const handleUpgradeClick = () => {
    trackEvent('click_upgrade_premium', {
      category: 'Monetization',
      label: 'Footer Upgrade Button'
    });
    goToPremium();
  };

  return (
    <footer className="w-full sticky bottom-0 left-0 md:static bg-gray-100 md:bg-transparent p-3 md:p-0 mt-8">
      <div className="w-full max-w-lg mx-auto flex justify-center items-center gap-4">
        {/* Replace with your actual BuyMeACoffee link */}
        <a
          href="https://buymeacoffee.com/yourname"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleSupportClick}
          className="bg-gray-900 text-white font-semibold rounded-xl py-2 px-4 text-sm hover:bg-gray-700 transition-colors"
        >
          ☕ Support the Developer
        </a>

        <button
          onClick={handleUpgradeClick}
          className="bg-purple-600 text-white font-semibold rounded-xl py-2 px-4 text-sm hover:bg-purple-700 transition-colors"
        >
          Upgrade to Premium
        </button>
      </div>
    </footer>
  );
};

export default Footer;
