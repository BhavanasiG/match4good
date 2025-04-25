import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// eslint-disable-next-line
export async function GET() {
  try {
    const completedListings = await prisma.application.findMany({
      where: {
        listing: {
          status: 'completed',
        },
      },
      include: {
        user: true,
        listing: true,
      },
    });

    const leaderboardMap = new Map<number, { name: string; points: number }>();

    completedListings.forEach(({ user, listing }) => {
      const existing = leaderboardMap.get(user.id);
      if (existing) {
        leaderboardMap.set(user.id, {
          name: user.username ?? 'Unnamed',
          points: existing.points + listing.pointValue,
        });
      } else {
        leaderboardMap.set(user.id, {
          name: user.username ?? 'Unnamed',
          points: listing.pointValue,
        });
      }
    });

    const leaderboard = Array.from(leaderboardMap.entries())
      .map(([id, { name, points }]) => ({
        id,
        name,
        totalPoints: points,
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 10); // top 10

    return NextResponse.json(leaderboard);
  } catch (err) {
    console.error('Error building leaderboard:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
