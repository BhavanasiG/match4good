/* eslint @typescript-eslint/no-unsafe-call: 0 */
/* eslint @typescript-eslint/no-unsafe-member-access: 0 */

import prisma from "../prisma.ts";
import { setIntervalAsync } from "set-interval-async";

/**
 *
 * @param {*} server Server
 */
export default function onServerStart(server) {
  let counter = 0;
  console.log("Got here");
  setInterval(() => {
    server.emit("counter", counter);
    counter += 1;
  }, 2000);

  // Handle Leaderboard Updates
  setInterval(async () => {
    let top_regions = await prisma.region.findMany({
      take: 10,
      select: { name: true, points: true },
      orderBy: { points: { _count: "desc" } },
    });
    console.log(top_regions);
  }, 1000);
}
