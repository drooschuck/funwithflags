import React from 'react';

/**
 * A reusable component to display an ad banner.
 * Google AdSense will automatically find and fill this container if it's configured.
 */
const AdBanner: React.FC = () => {
  return (
    <div className="w-full min-h-[100px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
      {/* This container can be used by Google AdSense. 
          Make sure your ad unit is configured for responsive sizes. */}
      <p>Advertisement</p>
    </div>
  );
};

export default AdBanner;
