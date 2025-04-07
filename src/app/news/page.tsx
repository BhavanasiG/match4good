// src/app/news/page.tsx
"use client";

import { useEffect, useState } from "react";

type Article = {
  title: string;
  url: string;
  source: { name: string };
  publishedAt: string;
  image: string;
  description: string;
};

const CATEGORIES = ["general", "world", "nation", "business", "technology", "entertainment", "sports", "science", "health"];
const REGIONS = ["us", "gb", "ca", "au", "in"];

export default function NewsPage() {
  const [category, setCategory] = useState("general");
  const [region, setRegion] = useState("gb");
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const apiKey = process.env.NEXT_PUBLIC_GNEWS_API_KEY;
      const url = `https://gnews.io/api/v4/top-headlines?token=${apiKey}&lang=en&country=${region}&topic=${category}`;
      const res = await fetch(url);
      const data = await res.json();
      setArticles(data.articles || []);
    };

    fetchNews();
  }, [category, region]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Latest News</h1>

      <div className="mb-6 flex gap-4">
        <select value={region} onChange={(e) => setRegion(e.target.value)} className="border p-2">
          {REGIONS.map((r) => (
            <option key={r} value={r}>{r.toUpperCase()}</option>
          ))}
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2">
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4">
        {articles.map((article, idx) => (
          <a key={idx} href={article.url} target="_blank" rel="noopener noreferrer" className="border p-4 rounded hover:bg-gray-50">
            <h2 className="text-xl font-semibold">{article.title}</h2>
            <p className="text-sm text-gray-600">{new Date(article.publishedAt).toLocaleString()}   {article.source.name}</p>
            <p className="mt-2 text-gray-700">{article.description}</p>
            {article.image && <img src={article.image} alt="Article" className="mt-2 max-h-48 object-cover rounded" />}
          </a>
        ))}
      </div>
    </div>
  );
}
