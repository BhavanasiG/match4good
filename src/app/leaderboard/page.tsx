"use client";

import { useEffect, useState } from "react";

type LeaderboardEntry = {
  name: string;
  totalPoints: number;
};

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      setLeaderboard(data);
    }

    fetchLeaderboard();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">#</th>
            <th className="p-2 text-left">Username</th>
            <th className="p-2 text-left">totalPoints</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{i + 1}</td>
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
