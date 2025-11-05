export interface FlagQuestion {
  flagUrl: string;
  options: string[];
  correctAnswer: string;
}

export enum AnswerState {
  IDLE,
  CORRECT,
  INCORRECT
}

export type Page = 'home' | 'quiz' | 'facts' | 'premium';

export interface CountryData {
  flagColorMeaning: string;
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
}

export interface DatabaseCountry {
    id?: number;
    name: string;
    flag_url: string;
    fun_fact?: string;
    detailed_data?: CountryData;
}