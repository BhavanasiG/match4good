import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const users = await prisma.user.findMany();

  return (
    <ol>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ol>
  );
}
