export interface FlagQuestion {
  questionText?: string; // Optional for flag-only quizzes
  flagUrl?: string; // Optional for text-only quizzes
  options: string[];
  correctAnswer: string;
}

export enum AnswerState {
  IDLE,
  CORRECT,
  INCORRECT
}

export type Page = 'home' | 'quiz' | 'facts' | 'premium';

export type QuizMode = 'flag-to-country' | 'country-to-capital' | 'country-to-continent';
export type Difficulty = 'beginner' | 'intermediate' | 'expert';

export interface CountryData {
  flagAnatomy: {
    description: string;
    colors: { color: string; meaning: string }[];
    symbols: { symbol: string; meaning: string }[];
  };
  countryInfo: {
    sovereignState: string;
    countryCodes: string;
    officialName: string;
    capitalCity: string;
    continent: string;
    memberOf: string;
    population: string;
    totalArea: string;
    highestPoint: string;
    lowestPoint: string;
    gdpPerCapita: string;
    currency: string;
    callingCode: string;
    internetTLD: string;
  };
  neighboringCountries: string[];
  funFact: string;
}

export interface DatabaseCountry {
    id?: number;
    name: string;
    flag_url: string;
    fun_fact?: string;
    detailed_data?: CountryData;
}