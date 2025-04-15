import prisma, { getUser } from "@/lib/prisma";
import Link from "next/link";

export default async function FollowingPage() {
  const user = await getUser(true);

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Organizations You Follow</h1>
        <p>You must be logged in to view this page.</p>
      </div>
    );
  }

  const follows = await prisma.follow.findMany({
    where: { userId: user.id },
    include: { organization: true },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Organizations You Follow</h1>
      {follows.length === 0 ? (
        <p>You are not following any organizations yet.</p>
      ) : (
        <ul className="space-y-4">
          {follows.map(({ organization }) => (
            <li key={organization.id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-bold">{organization.name}</h2>
              <p>{organization.description}</p>
              <Link
                href={`/org/${organization.id}`}
                className="text-blue-500 underline"
              >
                View Organization
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

