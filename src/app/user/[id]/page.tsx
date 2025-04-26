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
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] to-[#f1f8e9] py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center mb-6">
          <div className="text-5xl mb-3">👤</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#388e3c] mb-2">
            {user.username}&rsquo;s Profile
          </h1>
          <p className="text-[#388e3c] text-sm">
            View their organization memberships and owned orgs.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <UserInfo user={user} />
        </div>
      </div>
    </div>
  );
}
