// This utility helps send events to Google Analytics 4.

// TypeScript declaration for the 'gtag' function, which is loaded from the Google script in index.html.
declare global {
  interface Window {
    gtag: (
      command: 'event',
      action: string,
      params?: { [key: string]: any }
    ) => void;
  }
}

/**
 * Sends a custom event to Google Analytics.
 * @param {string} action - The name of the event (e.g., 'quiz_start').
 * @param {object} params - An object of key-value pairs for additional event data.
 */
export const trackEvent = (action: string, params?: { [key: string]: any }): void => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, params);
  } else {
    console.warn('Google Analytics gtag function not found.');
  }
};
