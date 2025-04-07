"use client";

import { useEffect, useState } from "react";

type Article = {
  title: string;
  url: string;
  source: { name: string };
  publishedAt: string;
  image?: string;
  description: string;
};

const CATEGORIES = [
  "general",
  "world",
  "nation",
  "business",
  "technology",
  "entertainment",
  "sports",
  "science",
  "health",
];

const REGIONS = ["us", "gb", "ca", "au", "in"];

export default function NewsPage() {
  const [category, setCategory] = useState("general");
  const [region, setRegion] = useState("gb");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_GNEWS_API_KEY;
        if (!apiKey) {
          console.error("Missing GNews API key");
          return;
        }

        const url = `https://gnews.io/api/v4/top-headlines?token=${apiKey}&lang=en&country=${region}&topic=${category}`;
        const res = await fetch(url);
        const data = await res.json();

        setArticles(data.articles || []);
      } catch (err) {
        console.error("Failed to fetch news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category, region]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📰 Latest News</h1>

      <div className="mb-6 flex gap-4">
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        >
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r.toUpperCase()}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading news...</p>
      ) : (
        <div className="grid gap-4">
          {articles.map((article, idx) => (
            <a
              key={idx}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border p-4 rounded hover:bg-gray-50 transition-shadow shadow-sm"
            >
              <h2 className="text-xl font-semibold">{article.title}</h2>
              <p className="text-sm text-gray-600">
                {new Date(article.publishedAt).toLocaleString()} –{" "}
                {article.source.name}
              </p>
              <p className="mt-2 text-gray-700">{article.description}</p>
              {article.image && (
                <img
                  src={article.image}
                  alt="Article"
                  className="mt-3 w-full max-h-60 object-cover rounded"
                />
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
