import { GetUser } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { UserInfo } from './user';

export default async function App() {
  const user = await GetUser(true);

  if (!user) {
    return notFound();
  }

  return (
    <div>
      <p>Welcome to your profile!</p>
      <Link href="/user/edit">Edit your information</Link>
      <UserInfo user={user} />
    </div>
  );
}
