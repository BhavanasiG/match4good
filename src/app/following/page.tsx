import prisma, { GetUser } from '@/lib/prisma';
import Link from 'next/link';

export default async function FollowingPage() {
  const user = await GetUser(true);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] to-[#f1f8e9] p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#388e3c] mb-4">Organizations You Follow</h1>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-lg text-gray-600">Please log in to view your followed organizations.</p>
          </div>
        </div>
      </div>
    );
  }

  const follows = await prisma.follow.findMany({
    where: { userId: user.id },
    include: { organization: true },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] to-[#f1f8e9] p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#388e3c] flex items-center gap-2 mb-2">
            <span>❤️</span>
            Organizations You Follow
          </h1>
          <p className="text-gray-600">Stay updated with your favorite organizations' latest activities</p>
        </header>

        {follows.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-lg text-gray-600">You're not following any organizations yet.</p>
            <Link 
              href="/org" 
              className="mt-4 inline-block bg-gradient-to-r from-[#4CAF50] to-[#81C784] text-white px-6 py-2 rounded-full hover:from-[#388e3c] hover:to-[#66bb6a] transition"
            >
              Explore Organizations
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {follows.map(({ organization }) => (
              <div 
                key={organization.id} 
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6"
              >
                <div className="flex flex-col h-full">
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold text-[#388e3c] mb-2">{organization.name}</h2>
                    <p className="text-gray-600 line-clamp-3 mb-4">{organization.description}</p>
                  </div>
                  <Link 
                    href={`/org/${organization.id}`}
                    className="mt-auto inline-block bg-gradient-to-r from-[#4CAF50] to-[#81C784] text-white px-4 py-2 rounded-full text-sm hover:from-[#388e3c] hover:to-[#66bb6a] transition"
                  >
                    View Organization →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
