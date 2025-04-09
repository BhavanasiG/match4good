"use client";

/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useState } from "react";
import Image from "next/image"; 

type Article = {
  title: string;
  url: string;
  source: { name: string };
  publishedAt: string;
  image?: string;
  description: string;
};

const CATEGORIES = [
  "General",
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data: { articles: Article[] } = await res.json();
        setArticles(data.articles || []);
      } catch (err) {
        console.error("Failed to fetch news:", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchNews();
  }, [category, region]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📰 Latest News</h1>

      <div className="mb-6 flex gap-4 flex-wrap">
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
      )}
    </div>
  );
}
