'use client';

import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IconTrophy } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

type LeaderboardEntry = {
  name: string;
  totalPoints: number;
};

const trophyEmojis = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      setLeaderboard(data);
    }

    fetchLeaderboard();
  }, []);

  return (
    <div className="p-5 md:p-24 space-y-10 w-screen max-w-4xl flex flex-col justify-center self-center">
      <div className="max-w-4xl space-y-10">
        <div className="text-center justify-center flex flex-col">
          <IconTrophy className="text-primary self-center" size={60} />
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2">
            Volunteer Leaderboard
          </h1>
          <p className="text-secondary-foreground text-lg">
            See who’s making the biggest impact in the community!
          </p>
        </div>
        <Card className="p-3 sm:p-6">
          <Table className="text-sm sm:text-base">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Rank</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>No leaderboard data</TableCell>
                </TableRow>
              ) : (
                leaderboard.map((user, index) => (
                  <TableRow
                    key={index}
                    className={
                      index < 3
                        ? 'bg-secondary hover:bg-secondary/50 text-secondary-foreground font-semibold'
                        : ''
                    }
                  >
                    <TableCell className="text-center font-semibold">
                      {trophyEmojis[index] || index + 1}
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.totalPoints}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
