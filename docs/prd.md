# Product Requirements Document (PRD): Fun with Flags

## 1. Introduction & Overview

- **Product Name**: Fun with Flags
- **Goal**: To create an engaging, interactive, and educational web application that allows users to test their knowledge of world flags and explore detailed information about different countries in a fun and intuitive way.

## 2. Target Audience

- **Students**: Learners of all ages studying geography, social studies, or world cultures.
- **Geography Enthusiasts**: Individuals with a passion for flags, maps, and world facts.
- **Casual Gamers**: Users looking for a fun and educational quiz to pass the time.
- **Lifelong Learners**: Anyone curious to learn something new about the world.

## 3. User Stories & Features

### Quiz Taker Persona
- **As a user, I want to** start a quiz to challenge my knowledge of world flags so that I can have fun and learn.
- **As a user, I want to** see a flag and be presented with multiple-choice options for the country name.
- **As a user, I want to** receive immediate visual feedback (e.g., green for correct, red for incorrect) after I select an answer.
- **As a user, I want to** see my score update in real-time as I answer questions correctly.
- **As a user, I want to** read a short, interesting fact about the country after I've answered a question to enhance my learning.
- **As a user, I want to** see my final score and the total number of questions at the end of the quiz.
- **As a user, I want to** have the option to restart the quiz and play again.

### Fact Explorer Persona
- **As a user, I want to** be able to explore facts about countries without having to take the quiz.
- **As a user, I want to** be able to easily search for a specific country by typing its name.
- **As a user, I want to** trigger the generation of facts manually with a button click after selecting a country.
- **As a user, I want to** view detailed information about the selected country, including:
  - An image of its flag.
  - The meaning and symbolism behind the flag's colors and design.
  - Key data points (capital, population, currency, continent, etc.).
  - The flags of its neighboring countries.
  - Its location on an interactive map.

## 4. Functional Requirements

### 4.1. Home Page
- The page must display the application title: "Fun with Flags".
- The page must present two clear choices to the user: "Start Quiz" and "Explore Country Facts".
- Clicking "Start Quiz" must navigate the user to the Quiz Page.
- Clicking "Explore Country Facts" must navigate the user to the Facts Page.

### 4.2. Quiz Page
- The page must display one flag question at a time from a predefined list.
- Each question must display a flag image and three multiple-choice country names.
- User interaction with answer options should be disabled after an answer is selected for the current question.
- The UI must clearly indicate the correct answer and the user's selected answer upon submission.
- The current score and question progress (e.g., "Question 5 / 35") must be visible.
- After an answer is submitted, the application must fetch and display a fun fact about the correct country. This fact should be cached for the session.
- A "Next Flag" button must appear after an answer is submitted to allow the user to proceed at their own pace.
- Upon completing all questions, a summary screen must display the final score.
- The summary screen must include a "Play Again" button that resets the quiz.

### 4.3. Facts Page
- The page must feature a searchable input field that filters a list of available countries as the user types.
- The user must be able to select a country from the filtered list.
- A "Go" or "Generate Facts" button must be present. This button should be disabled until a valid country is selected.
- Clicking the button must trigger an API call to the Gemini API to fetch structured data for the selected country.
- While data is being fetched, a clear loading indicator must be displayed.
- If an error occurs during the API call, a user-friendly error message must be shown.
- Once fetched, the data must be displayed in distinct, well-organized sections:
  1.  **Flag Details**: Flag image and a paragraph on color/symbol meanings.
  2.  **Country Information**: A key-value list of data points.
  3.  **Neighboring Countries**: A display of the flags and names of bordering nations.
  4.  **Country Location**: An embedded, interactive map.
- Fetched data for a country must be cached for the current session to prevent repeated API calls for the same country.
