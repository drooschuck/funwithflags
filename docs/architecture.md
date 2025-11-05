# Application Architecture

This document outlines the technical architecture of the "Fun with Flags" application.

## Overview

"Fun with Flags" is a client-side Single Page Application (SPA) built using React and TypeScript. The architecture includes Supabase for authentication and a persistent database, along with several third-party integrations for monetization and analytics, making it a robust, full-stack solution.

## Component Breakdown

- **`App.tsx`**: The root component. It manages the user's authentication session and acts as a router, rendering the correct page based on the application state.
- **`AuthPage.tsx`**: Handles user sign-up and login via Supabase authentication.
- **`HomePage.tsx`**, **`QuizPage.tsx`**, **`FactsPage.tsx`**: Stateful components for the main application features. Their data fetching logic follows a "cache-first" strategy with Supabase.
- **`PremiumPage.tsx`**: A new component that displays the benefits of the premium tier and provides an upgrade path.
- **`Footer.tsx`**: A persistent component for authenticated users, containing links for supporting the developer and upgrading to premium.
- **`AdBanner.tsx`**: A reusable component that serves as a designated placeholder for Google AdSense ads.
- **`AffiliateCard.tsx`**: A reusable component for displaying promotional affiliate content.

## Authentication

User authentication is handled entirely by Supabase. The `App.tsx` component listens for authentication state changes and manages the user session, ensuring that protected pages are only accessible to logged-in users.

## Data Flow and Persistence

The application uses a "cache-first" data flow model with Supabase as the persistent layer.

1.  **User Request**: A user requests a fun fact or detailed country information.
2.  **Database Query**: The application first queries the `countries` table in Supabase.
3.  **Return Cached Data**: If the data is found, it is served directly from the database.
4.  **API Fallback**: If the data is not in the database, the application calls the Google Gemini API.
5.  **Database Write**: The new data from Gemini is saved to the Supabase `countries` table.
6.  **Return New Data**: The newly generated data is returned to the client.

This architecture minimizes API usage, reduces latency on subsequent requests, and creates a shared knowledge base for all users.

## Third-Party Integrations

### Google Analytics 4
- **Integration**: The GA4 tracking script is included in `index.html`.
- **Implementation**: A utility module, `analytics.ts`, provides a `trackEvent` function that communicates with the `gtag` function provided by the Google script.
- **Usage**: Key user interactions, such as starting a quiz, completing a quiz, and clicking monetization buttons, are tracked by calling `trackEvent` from the relevant components.

### Google AdSense
- **Integration**: The AdSense script is included in `index.html`.
- **Implementation**: The `AdBanner.tsx` component creates a styled container on pages where ads are intended to be displayed. Google AdSense automatically detects and populates these containers based on the publisher ID and ad unit configuration.