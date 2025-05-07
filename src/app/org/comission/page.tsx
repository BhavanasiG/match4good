'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Charity {
  id: string;
  name: string;
  activities: string;
  region: string;
  url: string;
}

const validCities = [
  'Newcastle',
  'Manchester',
  'Liverpool',
  'Leeds',
  'Sheffield',
  'Nottingham',
  'Birmingham',
  'Coventry',
  'Cambridge',
  'Norwich',
  'London',
  'Brighton',
  'Southampton',
  'Bristol',
  'Plymouth',
  'Cardiff',
];

export default function CharityList() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState('');
  const [fadeIn, setFadeIn] = useState(false);

  const fetchCharities = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams(region ? { region } : {});
      console.log('Query URL:', `/api/charity_api?${queryParams.toString()}`); // Debugging

      const res = await fetch(`/api/charity_api?${queryParams}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setCharities(data);
      } else {
        setError('Failed to load charities.');
      }
    } catch (e) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
      setFadeIn(true);
    }
  };

  useEffect(() => {
    fetchCharities();
  }, []);

  // For fade-in animation on grid
  useEffect(() => {
    if (charities.length > 0) {
      setFadeIn(false);
      setTimeout(() => setFadeIn(true), 100);
    }
  }, [charities]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Filters Section */}
      <section className="bg-white p-6 rounded-2xl shadow mb-10 border border-green-100">
        <form
          className="flex flex-col sm:flex-row items-stretch gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            fetchCharities();
          }}
        >
          <div className="flex-1">
            <label htmlFor="region" className="block text-sm font-semibold text-gray-700 mb-1">
              Filter by City
            </label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="border border-green-200 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              <option value="">All Cities</option>
              {validCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="sm:w-auto w-full px-7 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-lg shadow hover:from-green-500 hover:to-green-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 flex items-center justify-center"
          >
            <span className="inline-block transition-transform group-hover:rotate-6">🔎</span> Apply
            Filter
          </button>
        </form>
      </section>

      {/* Charity List */}
      <h2 className="text-2xl font-extrabold text-[#388e3c] mb-6 text-center tracking-tight">
        Top 5 Charities
      </h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4 text-center">
          {error}
        </div>
      )}
      {loading && (
        <div className="text-center text-green-700 font-medium mb-4 animate-pulse">
          Loading charities...
        </div>
      )}

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 gap-8 transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
      >
        {charities.map((charity) => (
          <Link
            key={charity.id}
            href={charity.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white border-2 border-green-100 rounded-2xl p-6 shadow-md hover:shadow-2xl hover:border-green-400 transition-all duration-300 group hover:-translate-y-1"
          >
            <h3 className="text-lg font-bold text-green-700 mb-1 group-hover:underline">
              {charity.name}
            </h3>
            <p className="text-sm text-gray-700 mb-2 line-clamp-2">{charity.activities}</p>
            <div className="flex items-center text-xs text-gray-500">
              <span className="mr-2">📍</span>
              {charity.region}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
