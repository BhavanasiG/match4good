'use client';

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
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] to-[#f1f8e9] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🏆</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#388e3c] mb-2">
            Volunteer Leaderboard
          </h1>
          <p className="text-[#388e3c] text-lg">
            See who’s making the biggest impact in the community!
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-green-50 text-[#388e3c]">
                <th className="p-3 text-left text-base font-semibold rounded-tl-2xl">#</th>
                <th className="p-3 text-left text-base font-semibold">Username</th>
                <th className="p-3 text-left text-base font-semibold rounded-tr-2xl">Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-gray-400 text-lg">
                    No leaderboard data yet.
                  </td>
                </tr>
              ) : (
                leaderboard.map((user, i) => (
                  <tr
                    key={i}
                    className={`border-t transition ${
                      i < 3 ? 'bg-green-50 font-bold text-[#388e3c]' : 'hover:bg-green-100'
                    }`}
                  >
                    <td className="p-3 text-lg">{trophyEmojis[i] || i + 1}</td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.totalPoints}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
