import type { Metadata } from 'next';
import NewsPage from './news';

export const metadata: Metadata = {
  title: `News - Match4Good`,
};

export default function App() {
  return <NewsPage />;
}
