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
          `https://gnews.io/api/v4/search?q=${encodeURIComponent(
            topic + ' ' + localCity,
          )}&token=${GNEWS_API_KEY}&lang=en&country=gb&max=10`,
        );
        let data = await res.json();

        // Fallback if no articles
        if (!data.articles || data.articles.length === 0) {
          res = await fetch(
            `https://gnews.io/api/v4/search?q=${encodeURIComponent(
              localCity,
            )}&token=${GNEWS_API_KEY}&lang=en&country=gb&max=10`,
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
          `https://gnews.io/api/v4/search?q=${encodeURIComponent(
            topic + ' UK',
          )}&token=${GNEWS_API_KEY}&lang=en&country=gb&max=10`,
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

  const renderArticles = (articles: Article[], label: string) => (
    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, idx) => (
        <a
          key={idx}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border border-green-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow flex flex-col"
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
            <div className="w-full h-48 bg-green-50 flex items-center justify-center text-green-400 text-sm">
              No Image Available
            </div>
          )}
          <div className="p-5 flex flex-col flex-grow">
            {/* Badge */}
            <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold rounded-full px-3 py-1 mb-2">
              {label}
            </span>
            <h2 className="text-lg font-bold mb-1 line-clamp-2 text-[#388e3c]">{article.title}</h2>
            <p className="text-sm text-gray-500 mb-2">
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
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] to-[#f1f8e9] py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <div className="text-4xl mb-2">📰</div>
          <h1 className="text-4xl font-extrabold text-[#388e3c] mb-2">Volunteering News Feed</h1>
          <p className="text-lg text-[#388e3c] max-w-2xl mx-auto">
            Stay up to date with the latest volunteering, charity, and community news in your area
            and across the UK.
          </p>
        </header>

        <div className="space-y-16">
          {/* Local Volunteering News */}
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-[#388e3c] flex items-center gap-2">
                📍 Local Volunteering{' '}
                {localCity && <span className="text-green-700">in {localCity}</span>}
              </h2>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="border border-green-200 p-2 rounded-lg bg-green-50 text-green-900 font-semibold focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              >
                {TOPICS.map((t) => (
                  <option key={t.query} value={t.query}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {loadingLocal ? (
              <div className="text-center text-green-600 py-8 font-semibold">
                Loading local volunteering news...
              </div>
            ) : localArticles.length > 0 ? (
              renderArticles(localArticles, 'Local Opportunity')
            ) : (
              <div className="text-center text-green-400 py-8">
                No local volunteering news found yet. Try another topic!
              </div>
            )}
          </section>

          {/* National Volunteering News */}
          <section>
            <h2 className="text-2xl font-bold text-[#388e3c] mb-6 flex items-center gap-2">
              🇬🇧 UK National Volunteering News
            </h2>
            {loadingNational ? (
              <div className="text-center text-green-600 py-8 font-semibold">
                Loading national volunteering news...
              </div>
            ) : nationalArticles.length > 0 ? (
              renderArticles(nationalArticles, 'National Opportunity')
            ) : (
              <div className="text-center text-green-400 py-8">
                No national volunteering news found yet. Try another topic!
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
