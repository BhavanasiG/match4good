'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type Article = {
  title: string;
  url: string;
  source: { name: string };
  publishedAt: string;
  image?: string;
  description: string;
};

const CATEGORIES = [
  'general',
  'world',
  'nation',
  'business',
  'technology',
  'entertainment',
  'sports',
  'science',
  'health',
];

export default function NewsPage() {
  const [category, setCategory] = useState('general');
  const [localCity, setLocalCity] = useState<string | null>(null);
  const [localArticles, setLocalArticles] = useState<Article[]>([]);
  const [nationalArticles, setNationalArticles] = useState<Article[]>([]);
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [loadingNational, setLoadingNational] = useState(false);

  const GNEWS_API_KEY = process.env.NEXT_PUBLIC_GNEWS_API_KEY;

  // Get user location and set local city
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const data = await res.json();
          const foundCity = data.address.city || data.address.town || data.address.village;
          setLocalCity(foundCity);
        } catch (err) {
          console.error('Failed to get city from geolocation', err);
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
      },
    );
  }, []);

  // Fetch local news based on city
  useEffect(() => {
    const fetchLocalNews = async () => {
      if (!localCity || !GNEWS_API_KEY) return;
      setLoadingLocal(true);
      try {
        const res = await fetch(
          `https://gnews.io/api/v4/search?q=${encodeURIComponent(
            localCity,
          )}&token=${GNEWS_API_KEY}&lang=en&country=gb&max=10`,
        );
        const data = await res.json();
        setLocalArticles(data.articles || []);
      } catch (err) {
        console.error('Failed to fetch local news', err);
      } finally {
        setLoadingLocal(false);
      }
    };

    fetchLocalNews();
  }, [localCity, GNEWS_API_KEY]);

  // Fetch national news based on category
  useEffect(() => {
    const fetchNationalNews = async () => {
      if (!GNEWS_API_KEY) return;
      setLoadingNational(true);
      try {
        const res = await fetch(
          `https://gnews.io/api/v4/top-headlines?token=${GNEWS_API_KEY}&lang=en&country=gb&topic=${category}&max=10`,
        );
        const data = await res.json();
        setNationalArticles(data.articles || []);
      } catch (err) {
        console.error('Failed to fetch national news', err);
      } finally {
        setLoadingNational(false);
      }
    };

    fetchNationalNews();
  }, [category, GNEWS_API_KEY]);

  const renderArticles = (articles: Article[]) => (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, idx) => (
        <a
          key={idx}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="border rounded overflow-hidden shadow hover:shadow-md transition-shadow bg-white flex flex-col"
        >
          {article.image && (
            <Image
              src={article.image}
              alt="Article"
              width={400}
              height={200}
              unoptimized
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4 flex flex-col flex-grow">
            <h2 className="text-lg font-semibold">{article.title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(article.publishedAt).toLocaleString()} – {article.source.name}
            </p>
            <p className="text-gray-700 mt-2 line-clamp-3">{article.description}</p>
          </div>
        </a>
      ))}
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📰 News Feed</h1>

      <div className="space-y-12">
        {/* Local News Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            📍 Local News {localCity && `in ${localCity}`}
          </h2>
          {loadingLocal ? (
            <p>Loading local news...</p>
          ) : localArticles.length > 0 ? (
            renderArticles(localArticles)
          ) : (
            <p className="text-gray-500">No local news found.</p>
          )}
        </div>

        {/* National News Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">🇬🇧 UK National News</h2>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 rounded"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c[0].toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {loadingNational ? (
            <p>Loading national news...</p>
          ) : nationalArticles.length > 0 ? (
            renderArticles(nationalArticles)
          ) : (
            <p className="text-gray-500">No national news found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
