"use server";

import prisma, { getUser } from "@/lib/prisma";
import { redirect } from "next/navigation";

type Data = {
  username: string;
};

export default async function updateUser({ username }: Data) {
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

  return redirect("/user");
}
