"use client";

import useValueListener from "@/hooks/useValueListener";

interface LeaderboardEntry {
  region_name: string;
  points: number;
}

/**
 * Displays a live updating leaderboard of top region points
 * @returns {Element} Leaderboard element
 */
export default function Leaderboard() {
  const top_regions = useValueListener<LeaderboardEntry[]>("leaderboard");

  return (
    <div>
      <h2>Regional Leaderboard</h2>
      {top_regions && (
        <ol>
          {top_regions.map((entry, idx) => (
            <li key={idx}>
              <h3>{entry.region_name}</h3>
              <p>{entry.points}</p>
            </li>
          ))}
        </ol>
      )}
      {!top_regions && <h3>Loading Leaderboard Entries...</h3>}
    </div>
  );
}
