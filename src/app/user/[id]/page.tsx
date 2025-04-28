import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { UserInfo } from '../user';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function App({ params }: PageProps) {
  const { id } = await params;

  const numericId = parseInt(id);
  if (isNaN(numericId)) {
    return notFound();
  }

  const user = await prisma.user.findUnique({
    where: { id: numericId },
    include: { memberOf: true, ownerOf: true },
  });

  if (!user) {
    return notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2">
          {user.username}&rsquo;s Profile
        </h1>
        <p className="text-muted-foreground text-sm">
          View their organization memberships and owned orgs.
        </p>
      </div>

      <UserInfo user={user} />
    </div>
  );
}
