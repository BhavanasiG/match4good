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

type NewsApiResponse = {
  status: string;
  totalResults: number;
  articles: Article[];
  code?: string;
  message?: string;
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

/**
 *
 * @returns {Element} News page
 */
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
        const q = `${topic} ${region}`;
        const from = date === 'any' ? '' : date;
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          q,
        )}&language=en&sortBy=${sortBy}&pageSize=18${from ? `&from=${from}` : ''}&apiKey=${NEWS_API_KEY}`;
        const res = await fetch(url);

        if (!res.ok) {
          const err = (await res
            .json()
            .catch(() => ({ status: 'error', message: 'Failed to parse error response' }))) as {
            status: string;
            message: string;
          };
          throw new Error(err.message || res.statusText || `Error status: ${res.status}`);
        }

        const data = (await res.json()) as NewsApiResponse;

        if (data.status !== 'ok') {
          throw new Error(data.message || 'Failed to fetch news');
        }

        setArticles(data.articles.filter((a: Article) => a.title && a.description));
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Failed to load news');
        } else if (typeof err === 'string') {
          setError(err);
        } else {
          setError('An unknown error occured while fetching news');
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchNews();
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

/**
 *
 * @param {object} props The component props
 * @param {Article} props.article A news article object
 * @param {string} props.topic The topic for the news component badge
 * @returns {Element} NewsComponent element
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
function NewsComponent({ article, topic }: { article: Article; topic: string }) {
  return (
    <Link href={article.url} className="w-full">
      <Card className="p-0 hover:shadow-lg hover:shadow-gray-300 transition-shadow duration-100 ease-in-out h-full flex flex-col">
        <CardHeader className="p-0 relative h-50 flex">
          {article.urlToImage ? (
            <Image
              src={article.urlToImage}
              fill
              alt={article.title}
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="size-full bg-accent p-10 items-center self-center flex justify-center">
              <Image src={'/logo_extended.svg'} width={393} height={73} alt="default image" />
            </div>
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
