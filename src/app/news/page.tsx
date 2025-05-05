'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type Article = {
  title: string;
  url: string;
  source: { name: string };
  publishedAt: string;
  urlToImage?: string;
  description: string;
};

const TOPICS = [
  { label: 'Volunteering', query: 'volunteering' },
  { label: 'Charity', query: 'charity' },
  { label: 'Community Initiatives', query: '"community initiatives"' },
  { label: 'Fundraising', query: 'fundraising' },
  { label: 'Youth Volunteering', query: '"youth volunteering"' },
  { label: 'Environmental', query: 'environment volunteering' },
];

const REGIONS = [
  { label: 'UK (default)', query: 'UK' },
  { label: 'England', query: 'England' },
  { label: 'Scotland', query: 'Scotland' },
  { label: 'Wales', query: 'Wales' },
  { label: 'Northern Ireland', query: '"Northern Ireland"' },
];

// Pre-calculate date strings for filters
const today = new Date();
const weekAgo = new Date();
weekAgo.setDate(today.getDate() - 7);
const monthAgo = new Date();
monthAgo.setMonth(today.getMonth() - 1);

const DATES = [
  { label: 'Any time', value: '' },
  { label: 'Past week', value: weekAgo.toISOString().split('T')[0] },
  { label: 'Past month', value: monthAgo.toISOString().split('T')[0] },
];

const SORTS = [
  { label: 'Latest', value: 'publishedAt' },
  { label: 'Relevancy', value: 'relevancy' },
  { label: 'Popularity', value: 'popularity' },
];

export default function NewsPage() {
  const [topic, setTopic] = useState(TOPICS[0].query);
  const [region, setRegion] = useState(REGIONS[0].query);
  const [date, setDate] = useState(DATES[0].value);
  const [sortBy, setSortBy] = useState(SORTS[0].value);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        // Compose query
        let q = `${topic} ${region}`;
        let from = date;
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          q
        )}&language=en&sortBy=${sortBy}&pageSize=18${from ? `&from=${from}` : ''}&apiKey=${NEWS_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.status !== 'ok') throw new Error(data.message || 'Failed to fetch news');
        setArticles(
          data.articles.filter((a: Article) => a.title && a.description)
        );
      } catch (err: any) {
        setError(err.message || 'Failed to load news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [topic, region, date, sortBy, NEWS_API_KEY]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] to-[#f1f8e9] py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <div className="text-4xl mb-2">📰</div>
          <h1 className="text-4xl font-extrabold text-[#388e3c] mb-2">UK Volunteering & Charity News</h1>
          <p className="text-lg text-[#388e3c] max-w-2xl mx-auto">
            Latest news about volunteering, charity, and community initiatives across the UK.
          </p>
        </header>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="border border-green-200 p-2 rounded-lg bg-green-50 text-green-900 font-semibold"
          >
            {TOPICS.map((t) => (
              <option key={t.query} value={t.query}>
                {t.label}
              </option>
            ))}
          </select>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="border border-green-200 p-2 rounded-lg bg-green-50 text-green-900 font-semibold"
          >
            {REGIONS.map((r) => (
              <option key={r.query} value={r.query}>
                {r.label}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-green-200 p-2 rounded-lg bg-green-50 text-green-900 font-semibold"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <select
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-green-200 p-2 rounded-lg bg-green-50 text-green-900 font-semibold"
          >
            {DATES.map((d) => (
              <option key={d.label} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {loading && <div className="text-center text-green-600 py-8 font-semibold">Loading news...</div>}
        {error && (
          <div className="text-center text-red-600 py-8 font-semibold">
            Error: {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, idx) => (
              <a
                key={idx}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-green-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow flex flex-col"
              >
                {article.urlToImage ? (
                  <Image
                    src={article.urlToImage}
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
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold rounded-full px-3 py-1 mb-2">
                    {TOPICS.find(t => t.query === topic)?.label}
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
        )}
      </div>
    </div>
  );
}
