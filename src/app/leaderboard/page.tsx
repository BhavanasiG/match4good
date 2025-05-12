import type { Metadata } from 'next';
import LeaderboardPage from './leaderboard';

export const metadata: Metadata = {
  title: 'Leaderboard - Match4Good',
};

export default function App() {
  return <LeaderboardPage />;
}
