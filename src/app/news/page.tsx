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

const TOPICS = [
  { label: 'Volunteering', query: 'volunteer' },
  { label: 'Charity', query: 'charity' },
  { label: 'Community Initiatives', query: 'community service' },
];

export default function NewsPage() {
  const [topic, setTopic] = useState(TOPICS[0].query);
  const [localCity, setLocalCity] = useState<string | null>(null);
  const [localArticles, setLocalArticles] = useState<Article[]>([]);
  const [nationalArticles, setNationalArticles] = useState<Article[]>([]);
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [loadingNational, setLoadingNational] = useState(false);

  const GNEWS_API_KEY = process.env.NEXT_PUBLIC_GNEWS_API_KEY;

  // Get user's city
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

  // Fetch local volunteering news
  useEffect(() => {
    const fetchLocalNews = async () => {
      if (!localCity || !GNEWS_API_KEY) return;
      setLoadingLocal(true);
      try {
        let res = await fetch(
          `https://gnews.io/api/v4/search?q=${encodeURIComponent(topic + ' ' + localCity)}&token=${GNEWS_API_KEY}&lang=en&country=gb&max=10`,
        );
        let data = await res.json();

        // Fallback if no articles
        if (!data.articles || data.articles.length === 0) {
          res = await fetch(
            `https://gnews.io/api/v4/search?q=${encodeURIComponent(localCity)}&token=${GNEWS_API_KEY}&lang=en&country=gb&max=10`,
          );
          data = await res.json();
        }

        setLocalArticles(data.articles || []);
      } catch (err) {
        console.error('Failed to fetch local news', err);
      } finally {
        setLoadingLocal(false);
      }
    };

    fetchLocalNews();
  }, [localCity, topic, GNEWS_API_KEY]);

  // Fetch national volunteering news
  useEffect(() => {
    const fetchNationalNews = async () => {
      if (!GNEWS_API_KEY) return;
      setLoadingNational(true);
      try {
        const res = await fetch(
          `https://gnews.io/api/v4/search?q=${encodeURIComponent(topic + ' UK')}&token=${GNEWS_API_KEY}&lang=en&country=gb&max=10`,
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
  }, [topic, GNEWS_API_KEY]);

  // Fixed conditional rendering here!
  const renderArticles = (articles: Article[], label: string) => (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, idx) => (
        <a
          key={idx}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white flex flex-col"
        >
          {article.image ? (
            <Image
              src={article.image}
              alt="Article Image"
              width={400}
              height={200}
              unoptimized
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
              No Image Available
            </div>
          )}
          <div className="p-4 flex flex-col flex-grow">
            {/* Badge */}
            <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold rounded-full px-3 py-1 mb-2">
              {label}
            </span>

            <h2 className="text-lg font-bold mb-1 line-clamp-2">{article.title}</h2>

            <p className="text-sm text-gray-600">
              {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}{' '}
              – {article.source.name}
            </p>

            <p className="text-gray-700 mt-2 text-sm line-clamp-3">{article.description}</p>
          </div>
        </a>
      ))}
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🤝 Volunteering News Feed</h1>

      <div className="space-y-12">
        {/* Local Volunteering News */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">
              📍 Local Volunteering {localCity && `in ${localCity}`}
            </h2>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="border p-2 rounded"
            >
              {TOPICS.map((t) => (
                <option key={t.query} value={t.query}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {loadingLocal ? (
            <p>Loading local volunteering news...</p>
          ) : localArticles.length > 0 ? (
            renderArticles(localArticles, 'Local Opportunity')
          ) : (
            <p className="text-gray-500">
              No local volunteering news found yet. Try another topic!
            </p>
          )}
        </div>

        {/* National Volunteering News */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">🇬🇧 UK National Volunteering News</h2>
          {loadingNational ? (
            <p>Loading national volunteering news...</p>
          ) : nationalArticles.length > 0 ? (
            renderArticles(nationalArticles, 'National Opportunity')
          ) : (
            <p className="text-gray-500">
              No national volunteering news found yet. Try another topic!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
