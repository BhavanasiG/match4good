'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { siteContent } from '@/config/siteConfig';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

const SORTS = [
  { label: 'Latest', value: 'publishedAt' },
  { label: 'Relevancy', value: 'relevancy' },
  { label: 'Popularity', value: 'popularity' },
];

const DATES = [
  { label: 'Any time', value: 'any' },
  { label: 'Past week', value: weekAgo.toISOString().split('T')[0] },
  { label: 'Past month', value: monthAgo.toISOString().split('T')[0] },
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
        let from = date === 'any' ? '' : date;
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          q,
        )}&language=en&sortBy=${sortBy}&pageSize=18${from ? `&from=${from}` : ''}&apiKey=${NEWS_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.status !== 'ok') throw new Error(data.message || 'Failed to fetch news');
        setArticles(data.articles.filter((a: Article) => a.title && a.description));
      } catch (err: any) {
        setError(err.message || 'Failed to load news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [topic, region, date, sortBy, NEWS_API_KEY]);

  return (
    <div className="min-h-screen flex flex-col">
      {/** Banner */}
      <section className="flex flex-col">
        <div className="flex items-center h-50 overflow-hidden relative">
          <Image
            src={'/news-background.jpg'}
            alt="Banner Image"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="flex flex-col bg-primary justify-center text-center items-center p-8 space-y-2">
          <h2 className="text-3xl font-semibold text-primary-foreground">News Bulletin</h2>
          <h3 className="text-xl text-primary-foreground">{siteContent.newsDescription}</h3>
        </div>
      </section>
      {/**  listings */}
      <section className="flex flex-col p-12 md:px-24 xl:px-40">
        {/* Filters Section - Positioned Directly Above Listings */}
        <div className="flex justify-end mb-8 space-x-5">
          <Select value={topic} onValueChange={(value: string) => setTopic(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TOPICS.map((obj, index) => (
                <SelectItem key={index} value={obj.query}>
                  {obj.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={region} onValueChange={(value: string) => setRegion(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((obj, index) => (
                <SelectItem key={index} value={obj.query}>
                  {obj.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(value: string) => setSortBy(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORTS.map((obj, index) => (
                <SelectItem key={index} value={obj.value}>
                  {obj.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={date} onValueChange={(value: string) => setDate(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DATES.map((obj, index) => (
                <SelectItem key={index} value={obj.value}>
                  {obj.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-rows-4 sm:grid-rows-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:grid-rows-none gap-10">
          {loading && <p className="text-center self-center">Loading...</p>}
          {error && (
            <p className="text-center self-center text-destructive">An error occured: {error} </p>
          )}
          {!loading && !error && (
            <>
              {articles.map((article, index) => (
                <NewsComponent key={index} article={article} topic={topic} />
              ))}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export function NewsComponent({ article, topic }: { article: Article; topic: string }) {
  return (
    <Link href={article.url} className="w-full">
      <Card className="p-0 hover:shadow-lg hover:shadow-gray-300 transition-shadow duration-100 ease-in-out h-full flex flex-col">
        <CardHeader className="relative h-50">
          {article.urlToImage ? (
            <Image
              src={article.urlToImage}
              fill
              alt={article.title}
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="object-cover" />
          )}
        </CardHeader>
        <CardContent className="space-y-5 px-5 pb-5 text-base flex flex-col items-left">
          <Badge>{TOPICS.find((t) => t.query === topic)?.label}</Badge>
          <CardTitle className="space-y-2 flex flex-col">
            <p className="text-lg font-semibold">{article.title}</p>
            <p className="text-accent-foreground">
              {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}{' '}
              – <em>{article.source.name}</em>
            </p>
          </CardTitle>
          <CardDescription className="line-clamp-3">{article.description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
{
  /* <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] to-[#f1f8e9] py-10 px-4">
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

        {loading && (
          <div className="text-center text-green-600 py-8 font-semibold">Loading news...</div>
        )}
        {error && <div className="text-center text-red-600 py-8 font-semibold">Error: {error}</div>}

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
                    {TOPICS.find((t) => t.query === topic)?.label}
                  </span>
                  <h2 className="text-lg font-bold mb-1 line-clamp-2 text-[#388e3c]">
                    {article.title}
                  </h2>
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
    </div> */
}
