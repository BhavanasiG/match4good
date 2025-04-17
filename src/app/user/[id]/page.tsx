import { notFound } from 'next/navigation';
import { UserInfo } from '../user';
import prisma from '@/lib/prisma';

interface PageProps {
  params: Promise<{ id: string }>; // Update params type to Promise
}

export default async function App({ params }: PageProps) {
  const { id } = await params;

  if (isNaN(parseInt(id))) {
    return notFound();
  }

  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
    include: { memberOf: true, ownerOf: true },
  });

  if (!user) {
    return notFound();
  }

  return <UserInfo user={user} />;
}
