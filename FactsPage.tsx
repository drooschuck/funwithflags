import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { FLAG_QUESTIONS } from './constants';
import { CountryData } from './types';
import AdBanner from './AdBanner';

interface FactsPageProps {
  goToHome: () => void;
}

const countryList = [...new Set(FLAG_QUESTIONS.map(q => q.correctAnswer))].sort();
const flagUrlMap = FLAG_QUESTIONS.reduce((acc, q) => {
  acc[q.correctAnswer] = q.flagUrl;
  return acc;
}, {} as Record<string, string>);

// Updated Schema to include Flag Anatomy
const schema = {
  type: Type.OBJECT,
  properties: {
    flagAnatomy: {
        type: Type.OBJECT,
        description: "Detailed breakdown of the flag's visual design.",
        properties: {
            description: { type: Type.STRING, description: "General description of the flag's design." },
            colors: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        color: { type: Type.STRING },
                        meaning: { type: Type.STRING }
                    }
                }
            },
            symbols: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        symbol: { type: Type.STRING },
                        meaning: { type: Type.STRING }
                    }
                }
            }
        }
    },
    countryInfo: {
      type: Type.OBJECT,
      properties: {
        sovereignState: { type: Type.STRING },
        countryCodes: { type: Type.STRING },
        officialName: { type: Type.STRING },
        capitalCity: { type: Type.STRING },
        continent: { type: Type.STRING },
        memberOf: { type: Type.STRING },
        population: { type: Type.STRING },
        totalArea: { type: Type.STRING },
        highestPoint: { type: Type.STRING },
        lowestPoint: { type: Type.STRING },
        gdpPerCapita: { type: Type.STRING },
        currency: { type: Type.STRING },
        callingCode: { type: Type.STRING },
        internetTLD: { type: Type.STRING },
      },
      required: ["sovereignState", "officialName", "capitalCity", "continent", "population", "currency"]
    },
    neighboringCountries: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    funFact: { type: Type.STRING, description: "A very unique, lesser-known fact about this country." }
  }
};

const FactsPage: React.FC<FactsPageProps> = ({ goToHome }) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // In-memory cache for the session only
  const [sessionCache, setSessionCache] = useState<Record<string, CountryData>>({});

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return [];
    return countryList.filter(country =>
      country.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleCountrySelect = (countryName: string) => {
    setSearchQuery(countryName);
    setSelectedCountry(countryName);
    setIsDropdownVisible(false);
    setCountryData(null);
    setError(null);
  };

  const handleGenerateFacts = async () => {
    if (!selectedCountry) return;

    if (sessionCache[selectedCountry]) {
      setCountryData(sessionCache[selectedCountry]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key missing");
      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Provide detailed educational information for: ${selectedCountry}. Focus on flag anatomy.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });
      
      const data: CountryData = JSON.parse(response.text);
      setCountryData(data);
      setSessionCache(prev => ({ ...prev, [selectedCountry]: data }));
    } catch (err: any) {
      console.error(err);
      setError("Unable to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const InfoRow: React.FC<{ label: string, value?: string }> = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 py-3 last:border-0">
      <dt className="text-gray-500 font-medium text-sm">{label}</dt>
      <dd className="text-gray-900 font-semibold text-sm sm:text-right mt-1 sm:mt-0">{value || 'N/A'}</dd>
    </div>
  );

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl overflow-hidden min-h-screen md:min-h-0">
      <div className="p-6 md:p-8 bg-indigo-600 text-white">
          <button onClick={goToHome} className="mb-4 text-white/80 hover:text-white font-medium flex items-center">
            ← Back to Home
          </button>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">World Explorer</h1>
          <p className="text-indigo-100 mb-6">Discover flags, facts, and maps.</p>
          
          <div className="relative">
             <div className="flex gap-2">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setIsDropdownVisible(true); }}
                    onFocus={() => setIsDropdownVisible(true)}
                    placeholder="Search country..."
                    className="w-full p-4 rounded-xl text-gray-900 shadow-lg focus:ring-4 focus:ring-indigo-400 outline-none"
                />
                <button
                    onClick={handleGenerateFacts}
                    disabled={!selectedCountry || isLoading}
                    className="bg-white text-indigo-600 font-bold px-6 rounded-xl hover:bg-gray-100 disabled:opacity-50"
                >
                    GO
                </button>
             </div>
             {isDropdownVisible && filteredCountries.length > 0 && (
                <ul className="absolute z-20 top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl max-h-60 overflow-y-auto text-gray-900">
                    {filteredCountries.map(c => (
                        <li key={c} onMouseDown={() => handleCountrySelect(c)} className="p-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-0">
                            {c}
                        </li>
                    ))}
                </ul>
             )}
          </div>
      </div>

      <div className="p-6 md:p-8 bg-gray-50">
        {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-indigo-600 font-medium animate-pulse">Consulting the atlas...</p>
            </div>
        )}

        {error && <div className="text-red-500 text-center py-8">{error}</div>}

        {countryData && !isLoading && (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* Quick Fact */}
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-2xl border border-yellow-200">
                <h3 className="font-bold text-yellow-800 mb-2">Did You Know?</h3>
                <p className="text-yellow-900 italic">"{countryData.funFact}"</p>
            </div>

            {/* Flag Anatomy Section */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <span className="text-3xl mr-3">🏳️</span> Flag Anatomy
              </h2>
              <div className="flex flex-col md:flex-row gap-8">
                 <div className="w-full md:w-1/3 flex flex-col items-center">
                    <img 
                        src={flagUrlMap[selectedCountry]} 
                        alt={`Flag of ${selectedCountry}`} 
                        className="w-full h-auto object-cover rounded-xl shadow-md border border-gray-100 mb-4" 
                    />
                    <p className="text-sm text-gray-500 text-center italic">{countryData.flagAnatomy.description}</p>
                 </div>
                 <div className="w-full md:w-2/3 space-y-6">
                    <div>
                        <h3 className="font-bold text-gray-700 mb-3 border-b pb-2">Colors</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {countryData.flagAnatomy.colors.map((c, i) => (
                                <div key={i} className="flex items-start">
                                    <div className="w-4 h-4 rounded-full mt-1 mr-2 border border-gray-200 shadow-sm" style={{ backgroundColor: c.color.toLowerCase() }}></div>
                                    <div>
                                        <span className="font-semibold capitalize text-gray-800">{c.color}</span>
                                        <p className="text-sm text-gray-600">{c.meaning}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {countryData.flagAnatomy.symbols.length > 0 && (
                        <div>
                            <h3 className="font-bold text-gray-700 mb-3 border-b pb-2">Symbols</h3>
                            <ul className="space-y-3">
                                {countryData.flagAnatomy.symbols.map((s, i) => (
                                    <li key={i} className="text-sm text-gray-700">
                                        <span className="font-bold text-indigo-900">{s.symbol}: </span>
                                        {s.meaning}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                 </div>
              </div>
            </section>

            {/* Stats Grid */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Key Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <InfoRow label="Capital" value={countryData.countryInfo.capitalCity} />
                <InfoRow label="Region" value={countryData.countryInfo.continent} />
                <InfoRow label="Population" value={countryData.countryInfo.population} />
                <InfoRow label="Currency" value={countryData.countryInfo.currency} />
                <InfoRow label="Sovereign State" value={countryData.countryInfo.sovereignState} />
                <InfoRow label="Official Name" value={countryData.countryInfo.officialName} />
              </div>
            </section>
            
            {/* Neighbors */}
            <section>
              <h3 className="font-bold text-gray-700 mb-3">Neighbors</h3>
              <div className="flex flex-wrap gap-3">
                {countryData.neighboringCountries && countryData.neighboringCountries.length > 0 ? (
                    countryData.neighboringCountries.map(neighbor => (
                         flagUrlMap[neighbor] && (
                            <div key={neighbor} className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm">
                                <img src={flagUrlMap[neighbor]} className="w-5 h-5 rounded-full mr-2 object-cover" />
                                <span className="text-sm font-medium">{neighbor}</span>
                            </div>
                         )
                    ))
                ) : <span className="text-gray-500 text-sm">No land borders (Island nation)</span>}
              </div>
            </section>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-md border-2 border-white">
                <iframe 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedCountry)}&t=&z=4&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-64 md:h-80"
                  loading="lazy"
                  title={`Map of ${selectedCountry}`}
                ></iframe>
            </div>

            <AdBanner />
          </div>
        )}
      </div>
    </div>
  );
};

export default FactsPage;