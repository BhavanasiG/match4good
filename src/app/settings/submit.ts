/**
 * Updates the user's username
 * @param username Accepts a username string
 */

"use server";

import prisma, { getUser } from "@/lib/prisma";

export type Props = { username: string };

<<<<<<< HEAD
/**
 *
 * @param {string} param0 - Accepts an object with a username string
 * @returns {Promise<void>} - Returns a promise that resolves when the user is updated
 */
=======
>>>>>>> e4ee13e (Applies prettier fixes)
export async function UpdateUser({ username }: Props) {
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
