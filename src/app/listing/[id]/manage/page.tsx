import prisma, { GetUser, SignupComplete } from '@/lib/prisma';
import { forbidden, notFound, redirect } from 'next/navigation';
import { ListingManagement } from './client';
import ListingInfo from '@/components/listingInfo';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IconArrowRight, IconBuilding } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function App({ params }: { params: Promise<{ id: string }> }) {
  const user = await GetUser(true);

  if (!user) {
    return forbidden();
  }

  if (user) {
    const signupCompleted = await SignupComplete();
    if (!signupCompleted) {
      redirect('/user/sign-up');
    }
  }

  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id: parseInt(id) },
    include: {
      applications: { include: { user: true } },
      organization: true,
    },
  });
  console.log(listing);
  if (!listing) {
    return notFound();
  }

  if (
    !user.memberOf.some((org) => org.id === listing.organizationId) &&
    !user.ownerOf.some((org) => org.id === listing.organizationId)
  ) {
    return forbidden();
  }

  return (
    <div className="min-h-screen h-fit py-10 px-4 flex justify-center self-center w-full max-w-6xl">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 w-full h-fit">
        <Card className="w-full flex flex-col h-fit">
          <CardHeader>
            <CardTitle>
              <p className="text-xl">{listing.name}</p>
              <div className="text-base text-muted-foreground mt-1 flex items-center space-x-2">
                <IconBuilding size={20} />
                <p>{listing.organization.name}</p>
              </div>
            </CardTitle>
            <CardDescription className="text-base">{listing.description}</CardDescription>
          </CardHeader>
          <CardContent className="text-base flex flex-col text-left space-y-2">
            <p>
              <span className="font-semibold">Start:</span>{' '}
              {listing.startDatetime.toLocaleString('en-GB', {
                dateStyle: 'full',
                timeStyle: 'long',
              })}
            </p>
            <p>
              <span className="font-semibold">End:</span>{' '}
              {listing.endDatetime.toLocaleString('en-GB', {
                dateStyle: 'full',
                timeStyle: 'long',
              })}
            </p>
          </CardContent>
          <CardFooter>
            <Link href={`/listing/${listing.id}`}>
              <Button className="cursor-pointer">
                View listing
                <IconArrowRight />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        <ListingManagement listing={listing} />
      </div>
    </div>
  );
}
