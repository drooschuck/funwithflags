import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { FLAG_QUESTIONS } from './constants';
import { CountryData } from './types';

interface FactsPageProps {
  goToHome: () => void;
}

const countryList = [...new Set(FLAG_QUESTIONS.map(q => q.correctAnswer))].sort();

const flagUrlMap = FLAG_QUESTIONS.reduce((acc, q) => {
  acc[q.correctAnswer] = q.flagUrl;
  return acc;
}, {} as Record<string, string>);

const schema = {
  type: Type.OBJECT,
  properties: {
    flagColorMeaning: { type: Type.STRING, description: "Symbolism and concise meaning of the colors and symbols on the country's flag." },
    countryInfo: {
      type: Type.OBJECT,
      properties: {
        sovereignState: { type: Type.STRING },
        countryCodes: { type: Type.STRING },
        officialName: { type: Type.STRING },
        capitalCity: { type: Type.STRING },
        continent: { type: Type.STRING },
        memberOf: { type: Type.STRING, description: "List of major organizations the country is a member of, separated by commas." },
        population: { type: Type.STRING },
        totalArea: { type: Type.STRING },
        highestPoint: { type: Type.STRING },
        lowestPoint: { type: Type.STRING },
        gdpPerCapita: { type: Type.STRING },
        currency: { type: Type.STRING },
        callingCode: { type: Type.STRING },
        internetTLD: { type: Type.STRING },
      },
      required: ["sovereignState", "countryCodes", "officialName", "capitalCity", "continent", "memberOf", "population", "totalArea", "highestPoint", "lowestPoint", "gdpPerCapita", "currency", "callingCode", "internetTLD"]
    },
    neighboringCountries: {
      type: Type.ARRAY,
      description: "A list of countries that share a land border with this country.",
      items: { type: Type.STRING }
    }
  },
  required: ["flagColorMeaning", "countryInfo", "neighboringCountries"]
};

const FactsPage: React.FC<FactsPageProps> = ({ goToHome }) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [factsCache, setFactsCache] = useState<Record<string, CountryData>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const filteredCountries = useMemo(() => {
    if (!searchQuery) {
      return [];
    }
    return countryList.filter(country =>
      country.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query !== selectedCountry) {
        setSelectedCountry('');
    }
    if (!isDropdownVisible) {
      setIsDropdownVisible(true);
    }
    if (!query) {
        setCountryData(null);
        setError(null);
    }
  };

  const handleCountrySelect = (countryName: string) => {
    setSearchQuery(countryName);
    setSelectedCountry(countryName);
    setIsDropdownVisible(false);
    setCountryData(null);
    setError(null);
  };

  const handleGenerateFacts = async () => {
    if (!selectedCountry) {
      setError("Please select a valid country from the list first.");
      return;
    }

    if (factsCache[selectedCountry]) {
      setCountryData(factsCache[selectedCountry]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setCountryData(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `Provide detailed information for the country: ${selectedCountry}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });
      
      const data: CountryData = JSON.parse(response.text);
      setCountryData(data);
      setFactsCache(prev => ({ ...prev, [selectedCountry]: data }));

    } catch (err) {
      console.error("Error fetching country data:", err);
      setError("Sorry, we couldn't fetch the facts for this country. Please try another one.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const InfoRow: React.FC<{ label: string, value?: string }> = ({ label, value }) => (
    <div className="flex justify-between border-b border-gray-200 py-2">
      <dt className="text-gray-600 font-medium">{label}</dt>
      <dd className="text-gray-800 text-right">{value || 'N/A'}</dd>
    </div>
  );

  return (
    <>
      <div className="w-full max-w-2xl">
         <button onClick={goToHome} className="mb-4 text-indigo-600 hover:text-indigo-800 font-semibold">
          &larr; Back to Home
        </button>
      </div>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Country & Flag Explorer</h1>
        
        <div className="flex gap-2 items-center">
            <div className="relative flex-grow">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setIsDropdownVisible(true)}
                    onBlur={() => setTimeout(() => setIsDropdownVisible(false), 150)}
                    placeholder="Type to search for a country..."
                    className="w-full p-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    aria-label="Search for a country"
                />
                {isDropdownVisible && searchQuery && filteredCountries.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCountries.map(country => (
                        <li
                        key={country}
                        onMouseDown={() => handleCountrySelect(country)}
                        className="px-4 py-2 cursor-pointer hover:bg-indigo-100"
                        >
                        {country}
                        </li>
                    ))}
                    </ul>
                )}
            </div>
            <button
                onClick={handleGenerateFacts}
                disabled={!selectedCountry || isLoading}
                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                Go
            </button>
        </div>
        
        {isLoading && <div className="text-center mt-8 text-indigo-600 font-semibold animate-pulse">Loading amazing facts...</div>}
        {error && <div className="text-center mt-8 text-red-600 font-semibold">{error}</div>}

        {!selectedCountry && !isLoading && !countryData && (
            <div className="text-center mt-8 text-gray-500">
                <p>Select a country and click "Go" to learn more about it.</p>
            </div>
        )}

        {countryData && !isLoading && (
          <div className="mt-8 space-y-8 animate-fade-in-up">
            
            {/* Flag Section */}
            <section>
              <h2 className="text-2xl font-bold mb-3">Flag of {selectedCountry}</h2>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                 <img src={flagUrlMap[selectedCountry]} alt={`Flag of ${selectedCountry}`} className="w-48 h-auto object-cover rounded-lg shadow-lg border-2 border-gray-100" />
                 <div>
                   <h3 className="text-lg font-semibold text-indigo-800">About the Flag's Colors</h3>
                   <p className="text-gray-700 mt-1">{countryData.flagColorMeaning}</p>
                 </div>
              </div>
            </section>

            {/* Country Info Section */}
            <section>
              <h2 className="text-2xl font-bold mb-3">Country Information</h2>
              <dl>
                <InfoRow label="Sovereign State" value={countryData.countryInfo.sovereignState} />
                <InfoRow label="Country codes" value={countryData.countryInfo.countryCodes} />
                <InfoRow label="Official name" value={countryData.countryInfo.officialName} />
                <InfoRow label="Capital city" value={countryData.countryInfo.capitalCity} />
                <InfoRow label="Continent" value={countryData.countryInfo.continent} />
                <InfoRow label="Member of" value={countryData.countryInfo.memberOf} />
                <InfoRow label="Population" value={countryData.countryInfo.population} />
                <InfoRow label="Total area" value={countryData.countryInfo.totalArea} />
                <InfoRow label="Highest point" value={countryData.countryInfo.highestPoint} />
                <InfoRow label="Lowest point" value={countryData.countryInfo.lowestPoint} />
                <InfoRow label="GDP per capita" value={countryData.countryInfo.gdpPerCapita} />
                <InfoRow label="Currency" value={countryData.countryInfo.currency} />
                <InfoRow label="Calling code" value={countryData.countryInfo.callingCode} />
                <InfoRow label="Internet TLD" value={countryData.countryInfo.internetTLD} />
              </dl>
            </section>
            
            {/* Neighbors Section */}
            <section>
              <h2 className="text-2xl font-bold mb-3">Flags of Neighboring Countries</h2>
              <div className="flex flex-wrap gap-4">
                {countryData.neighboringCountries.length > 0 ? countryData.neighboringCountries.map(neighbor => (
                  flagUrlMap[neighbor] ? (
                    <div key={neighbor} className="text-center">
                      <img src={flagUrlMap[neighbor]} alt={`Flag of ${neighbor}`} className="w-24 h-auto rounded shadow border" />
                      <p className="mt-1 text-sm font-medium">{neighbor}</p>
                    </div>
                  ) : null
                )) : <p>This country has no land neighbors or they are not in our list.</p>}
              </div>
            </section>

            {/* Map Section */}
            <section>
              <h2 className="text-2xl font-bold mb-3">Country Location</h2>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border-2 border-gray-200">
                <iframe 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedCountry)}&t=&z=5&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full"
                  loading="lazy"
                  title={`Map of ${selectedCountry}`}
                ></iframe>
              </div>
            </section>

          </div>
        )}
      </div>
    </>
  );
};

export default FactsPage;