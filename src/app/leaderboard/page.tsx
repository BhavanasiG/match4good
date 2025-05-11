'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

type UserLeaderboardEntry = {
  userId: number;
  name: string;
  totalPoints: number;
  regionName: string | null;
  profilePictureUrl: string | null;
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

const trophyEmojis = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const [combinedLeaderboard, setCombinedLeaderboard] = useState<CombinedLeaderboardData | null>(
    null,
  ); // State for combined data
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Establish the Server-Sent Events connection
    const eventSource = new EventSource('/api/leaderboard-stream');

    // Event listener for the connection opening
    eventSource.onopen = () => {
      console.log('EventSource connection opened.');
      setIsConnected(true);
      setError(null);
    };

    // Event listener for errors
    eventSource.onerror = (event) => {
      console.error('EventSource error:', event);
      setIsConnected(false);

      // Check if the connection is closed or cannot be established
      if (eventSource.readyState === EventSource.CLOSED) {
        console.log('EventSource connection closed.');
        setError('Leaderboard connection closed.');
      } else {
        setError('An error occurred with the leaderboard connection.');
      }

      if (eventSource.readyState !== EventSource.CLOSED) {
        eventSource.close();
      }
      setCombinedLeaderboard(null); // Clear data on error
    };

    // Event listener for the initial-data event (sent once on connection)
    eventSource.addEventListener('initial-data', (event) => {
      console.log('Received initial combined leaderboard data.');
      try {
        const data: CombinedLeaderboardData = JSON.parse(event.data);
        setCombinedLeaderboard(data);
        setError(null);
      } catch (e) {
        console.error('Error parsing initial combined leaderboard data:', e);
        setError('Failed to parse initial leaderboard data.');
        setCombinedLeaderboard({ users: [], regions: [] });
      }
    });

    // Event listener for the 'update' event (sent periodically)
    eventSource.addEventListener('update', (event) => {
      console.log('Received combined leaderboard update.');
      try {
        const updatedData: CombinedLeaderboardData = JSON.parse(event.data);
        setCombinedLeaderboard(updatedData);
        setError(null);
      } catch (e) {
        console.error('Error parsing combined leaderboard update:', e);
        setError('Failed to parse combined leaderboard update.');
      }
    });

    // Cleanup function: close the connection when the component unmounts
    return () => {
      console.log('Closing EventSource connection...');
      if (eventSource.readyState !== EventSource.CLOSED) {
        eventSource.close();
      }
    };
  }, []); // Empty dependency array means this effect runs only once on mount

  // Helper to render loading/empty/error states
  const renderTableBodyContent = (
    data: any[] | null | undefined,
    colSpan: number,
    type: 'users' | 'regions',
  ) => {
    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={colSpan} className="text-center py-8 text-red-500">
            {error}
          </TableCell>
        </TableRow>
      );
    }
    if (data === null || data === undefined) {
      return (
        <TableRow>
          <TableCell colSpan={colSpan} className="text-center py-8 text-gray-400">
            Loading {type === 'users' ? 'users' : 'regions'}...
          </TableCell>
        </TableRow>
      );
    }
    if (data.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={colSpan} className="text-center py-8 text-gray-400 text-lg">
            No {type === 'users' ? 'user' : 'region'} data yet.
          </TableCell>
        </TableRow>
      );
    }
    return null; // Render actual data rows if none of the above
  };

  return (
    <div className="p-5 sm:p-10 md:p-20 lg:px-40 xl:px-80 space-y-10">
      <div className="text-center mb-8 space-y-2">
        {/* <div className="text-4xl">🏆</div> */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">
          Volunteer Leaderboards
        </h1>
        <p className="text-muted-foreground text-lg">
          See who and which regions are creating the greatest positive impact!
        </p>
        <p
          className={`text-sm ${isConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
        >
          Connection Status: {isConnected ? 'Live' : 'Disconnected'}
        </p>
      </div>

      {/* --- Tabs Container for Leaderboards --- */}

      <Tabs defaultValue="regions" className="w-full">
        {/* Tabs List for selecting between Leaderboards */}
        <TabsList className="grid w-full grid-cols-2 mb-4 md:w-[400px] mx-auto">
          {' '}
          <TabsTrigger value="volunteers">Top Volunteers</TabsTrigger>
          <TabsTrigger value="regions">Top Regions</TabsTrigger>
        </TabsList>

        {/* --- Volunteers Leaderboard Tab Content --- */}
        <TabsContent value="volunteers">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Top Volunteers</CardTitle>
              <CardDescription>Users ranked by total volunteer points.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden md:table-cell">Region</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Render loading/empty/error states for users */}
                  {renderTableBodyContent(combinedLeaderboard?.users, 4, 'users')}

                  {/* Render user data if available */}
                  {combinedLeaderboard?.users &&
                    combinedLeaderboard.users.length > 0 &&
                    !error &&
                    combinedLeaderboard.users.map((user, i) => (
                      <TableRow
                        key={user.userId}
                        className={`${i < 3 ? 'bg-primary/10 font-semibold' : 'hover:bg-muted/50'} transition-colors`}
                      >
                        <TableCell className="text-lg">{i < 3 ? trophyEmojis[i] : i + 1}</TableCell>
                        {/* Display user profile picture and name */}
                        <TableCell className="flex items-center gap-3">
                          <Avatar className="size-8">
                            {user.profilePictureUrl ? (
                              <Image
                                src={user.profilePictureUrl}
                                alt={`${user.name}'s profile picture`}
                                width={32}
                                height={32}
                                className="object-cover rounded-full"
                              />
                            ) : (
                              <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
                            )}
                          </Avatar>
                          <span>{user.name}</span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                          {user.regionName || 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">{user.totalPoints}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Regions Leaderboard Tab Content --- */}
        <TabsContent value="regions">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Top Regions</CardTitle>
              <CardDescription>
                Regions ranked by total volunteer points from users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Render loading/empty/error states for regions */}
                  {renderTableBodyContent(combinedLeaderboard?.regions, 3, 'regions')}

                  {/* Render region data if available */}
                  {combinedLeaderboard?.regions &&
                    combinedLeaderboard.regions.length > 0 &&
                    !error &&
                    combinedLeaderboard.regions.map((region, i) => (
                      <TableRow
                        key={region.id}
                        className={`${i < 3 ? 'bg-primary/10 font-semibold' : 'hover:bg-muted/50'} transition-colors`}
                      >
                        <TableCell className="text-lg">{i < 3 ? trophyEmojis[i] : i + 1}</TableCell>
                        <TableCell>{region.name}</TableCell>
                        <TableCell className="text-right">{region.totalPoints}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {combinedLeaderboard !== null && !error && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          Leaderboards update periodically - every 5 seconds.
        </p>
      )}
    </div>
  );
}
