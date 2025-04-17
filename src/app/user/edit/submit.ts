'use server';

import prisma, { GetUser } from '@/lib/prisma';
import { redirect } from 'next/navigation';

type Data = {
  username: string;
};

/**
 *
 * @param {string} param0 - Accepts an object with a username string
 * @returns {Promise<void>} - Returns a promise that resolves when the user is updated
 */
export default async function UpdateUser({ username }: Data) {
  const user = await GetUser();

  if (!user) {
    return;
  }

  await prisma.user.update({
    where: {
      userId: user.userId,
    },
    data: {
      username: username,
    },
  });

  return redirect('/user');
}
