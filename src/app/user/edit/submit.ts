"use server";

import prisma, { getUser } from "@/lib/prisma";

type Data = {
  username: string;
};

export default async function updateUser({ username }: Data) {
  const user = await getUser();
  console.log(user);

  if (!user) {
    return;
  }

  const updateUser = await prisma.user.update({
    where: {
      user_id: user.user_id,
    },
    data: {
      username: username,
    },
  });

  console.log(updateUser);
}
