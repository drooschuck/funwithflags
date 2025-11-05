import React from 'react';
import { trackEvent } from './analytics';

const AffiliateCard: React.FC = () => {
  const handleAffiliateClick = () => {
    trackEvent('click_affiliate_link', {
      category: 'Monetization',
      label: 'Learn More Geography CTA'
    });
  };

  return (
    <div className="w-full bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-4 text-center">
      <h3 className="font-bold text-gray-800">Learn More About Geography!</h3>
      <p className="text-gray-600 text-sm mt-1 mb-3">
        Explore geography courses, books, and games through our partners.
      </p>
      <a
        // Replace this with your actual affiliate link
        href="#affiliate-link"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleAffiliateClick}
        className="inline-block bg-green-600 text-white font-bold text-sm py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-300"
      >
        Explore Now
      </a>
    </div>
  );
};

export default AffiliateCard;
