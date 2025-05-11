import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type UserLeaderboardEntry = {
  userId: number;
  name: string;
  totalPoints: number;
  regionName: string | null;
};
type RegionLeaderboardEntry = {
  id: number;
  name: string;
  totalPoints: number;
};

type CombinedLeaderboardData = {
  users: UserLeaderboardEntry[];
  regions: RegionLeaderboardEntry[];
};

type SsePayload = CombinedLeaderboardData | { error: string };

const connectedControllers: Set<ReadableStreamDefaultController> = new Set();

const encoder = new TextEncoder();

// Function to fetch the latest leaderboard data
const fetchCombinedLeaderboardData = async (): Promise<CombinedLeaderboardData> => {
  try {
    // Fetch top users by totalPoints
    const topUsers = await prisma.user.findMany({
      orderBy: {
        totalPoints: 'desc',
      },
      take: 50,
      select: {
        id: true,
        username: true,
        totalPoints: true,
        profilePictureUrl: true,
        region: {
          select: {
            name: true,
          },
        },
      },
    });

    // Fetch top regions by points
    const topRegions = await prisma.region.findMany({
      orderBy: {
        points: 'desc',
      },
      take: 7,
      select: {
        id: true,
        name: true,
        points: true,
      },
    });

    // Map Prisma results to the desired types
    const userLeaderboardData: UserLeaderboardEntry[] = topUsers.map((user) => ({
      userId: user.id,
      name: user.username,
      totalPoints: user.totalPoints,
      regionName: user.region?.name || null,
      profilePictureUrl: user.profilePictureUrl || null,
    }));

    const regionLeaderboardData: RegionLeaderboardEntry[] = topRegions.map((region) => ({
      id: region.id,
      name: region.name,
      totalPoints: region.points,
    }));

    return { users: userLeaderboardData, regions: regionLeaderboardData };
  } catch (error) {
    console.error('Error fetching combined leaderboard data for stream:', error);

    return { users: [], regions: [] };
  }
};

// Set up an interval to periodically fetch and broadcast updates
let updateInterval: NodeJS.Timeout | null = null;
const INTERVAL_MILLISECONDS = 5000; // Fetch and send updates every 5 seconds

const startBroadcastingUpdates = () => {
  if (updateInterval !== null) {
    return;
  }

  updateInterval = setInterval(async () => {
    console.log('Fetching and broadcasting combined leaderboard update...');
    const latestLeaderboardData = await fetchCombinedLeaderboardData();

    // Send the update to all connected clients
    const jsonString = JSON.stringify(latestLeaderboardData);
    const eventMessage = `event: update\ndata: ${jsonString}\n\n`;
    const encodedMessage = encoder.encode(eventMessage);

    connectedControllers.forEach((controller) => {
      try {
        controller.enqueue(encodedMessage);
      } catch (error) {
        // Handle errors sending to a specific client (e.g., if stream is closed)
        console.error('Error sending update to a client:', error);
        // Remove the controller from the set if sending fails
        controller.error(error);
        connectedControllers.delete(controller);
      }
    });

    // Stop the interval if there are no more connected clients
    if (connectedControllers.size === 0 && updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
      console.log('Stopped leaderboard broadcast interval (no connected clients).');
    }
  }, INTERVAL_MILLISECONDS);

  console.log('Started periodic leaderboard broadcast interval.');
};

/**
 * Server-Sent Events (SSE) endpoint to stream leaderboard data.
 * Sends initial data and then periodic updates.
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} - A streaming response for SSE.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/require-await
export async function GET(request: NextRequest) {
  const headers = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Content-Type': 'text/event-stream',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Cache-Control': 'no-cache',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Connection: 'keep-alive',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'X-Accel-Buffering': 'no', // Recommended for Nginx to prevent buffering
  };

  const stream = new ReadableStream({
    async start(controller) {
      console.log('Client connected to leaderboard stream.');
      connectedControllers.add(controller);

      // Function to send data in SSE format
      const sendEvent = (
        controller: ReadableStreamDefaultController,
        data: SsePayload,
        eventName = 'message',
      ) => {
        const jsonString = JSON.stringify(data);
        controller.enqueue(encoder.encode(`event: ${eventName}\n`));
        controller.enqueue(encoder.encode(`data: ${jsonString}\n\n`));
      };

      try {
        // Fetch and send the initial leaderboard data
        const initialLeaderboardData = await fetchCombinedLeaderboardData();
        sendEvent(controller, initialLeaderboardData, 'initial-data');
        console.log(`Sent initial combined leaderboard data.`);

        // Start the periodic broadcasting
        startBroadcastingUpdates();

        // Keep the connection open until the client disconnects
        request.signal.onabort = () => {
          console.log('Client signaled abort for leaderboard stream.');
          connectedControllers.delete(controller);
        };
      } catch (error: unknown) {
        console.error('Error in leaderboard stream start function:', error);

        sendEvent(controller, { error: 'Failed to start leaderboard stream.' }, 'error');
        controller.error(error instanceof Error ? error : new Error(String(error)));
        controller.close();
        connectedControllers.delete(controller);
      }
    },
    cancel(controller) {
      console.log('Leaderboard stream cancelled.');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      connectedControllers.delete(controller);
    },
  });

  // Return the stream in the response
  return new NextResponse(stream, { headers });
}
