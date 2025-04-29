import { GetUser } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import EditUserForm from './form';

export default async function App() {
  const user = await GetUser();

  if (!user) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] to-[#f1f8e9] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">👤</div>
          <h1 className="text-3xl font-extrabold text-[#388e3c]">Edit Profile</h1>
          <p className="text-[#388e3c] mt-2">
            Hello, <span className="font-semibold">{user.username}</span>
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#388e3c] mb-4">Change Your Information</h2>
          <EditUserForm user={user} />
          <div className="mt-6 text-center">
            <Link
              href="/user"
              className="inline-block text-[#388e3c] font-semibold underline hover:text-[#256029] transition"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
