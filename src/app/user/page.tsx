import { GetUser } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { UserInfo } from './user';
import { Button } from '@/components/ui/button';

export default async function App() {
  const user = await GetUser(true);

  if (!user) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] to-[#f1f8e9] py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center mb-6">
          <div className="text-5xl mb-3">👤</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#388e3c] mb-2">
            Welcome to your profile, <span className="capitalize">{user.username}</span>!
          </h1>
          <Link href="/user/edit">
            <Button className="font-semibold text-sm px-5 py-2 mt-2 bg-gradient-to-r from-[#4CAF50] to-[#81C784] text-white hover:from-[#388e3c] hover:to-[#66bb6a] border-none shadow">
              ✏️ Edit Your Information
            </Button>
          </Link>
          <p className="text-[#388e3c] text-sm mt-3">
            Manage your personal information and organization memberships.
          </p>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <UserInfo user={user} />
        </div>
      </div>
    </div>
  );
}
