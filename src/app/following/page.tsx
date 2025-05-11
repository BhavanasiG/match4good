import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import prisma, { GetUser, SignupComplete } from '@/lib/prisma';
import {
  IconArrowLeft,
  IconArrowRight,
  IconBuilding,
  IconMailbox,
  IconMailboxOff,
  IconSearchOff,
} from '@tabler/icons-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import FollowButton from '@/components/FollowButton';

export default async function FollowingPage() {
  const user = await GetUser(true);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] to-[#f1f8e9] p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#388e3c] mb-4">Organizations You Follow</h1>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-lg text-gray-600">
              Please log in to view your followed organizations.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    const signupCompleted = await SignupComplete();
    if (!signupCompleted) {
      redirect('/user/sign-up');
    }
  }

  const follows = await prisma.follow.findMany({
    where: { userId: user.id },
    include: {
      organization: {
        include: {
          followers: true,
        },
      },
    },
  });

  return (
    <div className="p-5 md:p-24 space-y-10 w-screen max-w-4xl flex flex-col justify-center self-center">
      <div>
        <h1 className="text-4xl font-bold text-primary flex items-center mb-2">
          Organizations You Follow
        </h1>
        <h2 className="text-secondary-foreground text-lg">
          Stay updated with your favorite organizations' latest activities
        </h2>
      </div>

      <Card className="p-6 bg-accent">
        {follows.length === 0 ? (
          <div className="flex flex-col justify-center self-center items-center space-y-5">
            <IconMailboxOff size={60} />
            <p>You're not following any organizations yet.</p>
            <Link href="/org">
              <Button className="cursor-pointer">
                Explore Organizations
                <IconArrowRight />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 w-full justify-center self-center items-center space-y-5">
            {follows.map(({ organization }) => (
              <div className="w-full">
                <Card className="hover:shadow-lg hover:shadow-gray-300 transition-shadow duration-100 ease-in-out h-full flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle>
                      <div className="text-base text-muted-foreground mt-1 flex items-center space-x-2">
                        <IconBuilding size={25} />
                        <p>{organization.name}</p>
                      </div>
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {organization.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex space-x-5">
                    <Link href={`/org/${organization.id}`}>
                      <Button className="cursor-pointer">View Organization</Button>
                    </Link>
                    <FollowButton
                      organizationId={organization.id}
                      isFollowing={organization.followers.some((f) => f.userId === user.id)}
                    />
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
