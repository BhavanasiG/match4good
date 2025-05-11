import { GetUser } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function App() {
  const user = await GetUser();

  if (!user) {
    redirect('/auth/login');
  }

  const userId = user.id;
  return redirect(`/user/${userId}`);
}
