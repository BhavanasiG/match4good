/**
 * Updates the user's username
 * @param username Accepts a username string
 */

"use server";

import prisma, { getUser } from "@/lib/prisma";

export type Props = { username: string };

export async function UpdateUser({ username } : Props) {
  const user = await getUser();

  if (!user) {
    return;
  }

  await prisma.user.update({
    where: {
      user_id: user.user_id,
    },
    data: {
      username: username,
    },
  });
}
