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
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2">
          Welcome to your profile, {user.username}!
        </h1>
        <Link href="/user/edit">
          <Button className="font-semibold text-sm px-5 py-2 mt-2">✏️ Edit Your Information</Button>
        </Link>
        <p className="text-muted-foreground text-sm mt-3">
          Manage your personal information and organization memberships.
        </p>
      </div>

      {/* Profile Details */}
      <UserInfo user={user} />
    </div>
  );
}
