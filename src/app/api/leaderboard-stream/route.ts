import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * @typedef {object} UserLeaderboardEntry - Represents a single user's entry in the leaderboard.
 * @property {number} userId - The unique ID of the user.
 * @property {string} name - The username of the user.
 * @property {number} totalPoints - The total points accumulated by the user.
 * @property {string | null} regionName - The name of the user's region, or null.
 */
type UserLeaderboardEntry = {
  userId: number;
  name: string;
  totalPoints: number;
  regionName: string | null;
};

/**
 * @typedef {object} RegionLeaderboardEntry - Represents a single region's entry in the leaderboard.
 * @property {number} id - The unique ID of the region.
 * @property {string} name - The name of the region.
 * @property {number} totalPoints - The total points accumulated by volunteers in this region.
 */
type RegionLeaderboardEntry = {
  id: number;
  name: string;
  totalPoints: number;
};

/**
 * @typedef {object} CombinedLeaderboardData - Contains arrays of user and region leaderboard entries.
 * @property {UserLeaderboardEntry[]} users - The list of user leaderboard entries.
 * @property {RegionLeaderboardEntry[]} regions - The list of region leaderboard entries.
 */
type CombinedLeaderboardData = {
  users: UserLeaderboardEntry[];
  regions: RegionLeaderboardEntry[];
};

/**
 * @typedef {CombinedLeaderboardData | { error: string }} SsePayload - The possible data structure for SSE messages.
 * Can be combined leaderboard data or an error object.
 */
type SsePayload = CombinedLeaderboardData | { error: string };

const connectedControllers: Set<ReadableStreamDefaultController> = new Set();

const encoder = new TextEncoder();

/**
 * Fetches the latest combined leaderboard data (top users and regions).
 * @returns {Promise<CombinedLeaderboardData>} A promise resolving with the combined leaderboard data.
 */
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
      totalPoints: user?.totalPoints,
      regionName: user?.region?.name || null,
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

/**
 * Starts the periodic broadcasting of leaderboard updates via SSE.
 * Ensures only one interval is running globally.
 */
const startBroadcastingUpdates = () => {
  if (updateInterval !== null) {
    return;
  }

  updateInterval = setInterval(async () => {
    // console.log('Fetching and broadcasting combined leaderboard update...');
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
 * Next.js API Route handler for the leaderboard SSE stream.
 * Establishes an SSE connection and streams periodic leaderboard updates.
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} A promise resolving with the streaming SSE response.
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

      /**
       * Sends an SSE event message to a specific controller.
       * @param {ReadableStreamDefaultController} controller - The controller to enqueue the message to.
       * @param {SsePayload} data - The data payload to send.
       * @param {string} eventName - The name of the SSE event.
       */
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
