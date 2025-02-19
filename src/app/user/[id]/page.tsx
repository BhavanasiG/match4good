import User from "@/lib/components/user";
import prisma from "@/lib/prisma";

export default async function App({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const username = (await params).id;
  const user = await prisma.user.findUnique({
    where: {
      id: username,
    },
    include: { member_of: true, owner_of: true },
  });

  return <User user={user} />;
}
