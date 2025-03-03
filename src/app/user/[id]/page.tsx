import { notFound } from "next/navigation";
import { UserInfo } from "../user";
import prisma from "@/lib/prisma";

export default async function App({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const id = (await params).id;
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: { member_of: true, owner_of: true },
  });

  if (!user) {
    return notFound();
  }

  return <UserInfo user={user} />;
}
