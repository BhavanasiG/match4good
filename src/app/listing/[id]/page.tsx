import { notFound, redirect } from 'next/navigation';
import prisma, { GetUser, SignupComplete } from '@/lib/prisma';
import ListingInfo from '@/components/listingInfo';
import MapWrapper from '@/components/MapWrapper'; // Updated import
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  IconArrowRight,
  IconBuilding,
  IconMapCancel,
  IconMapPin,
  IconSettings,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Jobs - Match4Good`,
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingPage({ params }: PageProps) {
  const { id } = await params;
  const user = await GetUser(true);

  if (user) {
    const signupCompleted = await SignupComplete();
    if (!signupCompleted) {
      redirect('/user/sign-up');
    }
  }

  if (isNaN(parseInt(id))) return notFound();

  const listing = await prisma.listing.findUnique({
    where: { id: parseInt(id) },
    include: { organization: true },
  });

  if (!listing) return notFound();

  const applied =
    user != null
      ? (await prisma.application.count({
          where: { listingId: listing.id, userId: user.id },
        })) > 0
      : false;

  const in_org =
    user != null
      ? user.memberOf.some((org) => org.id === listing.organizationId) ||
        user.ownerOf.some((org) => org.id === listing.organizationId)
      : false;

  return (
    <div className="min-h-screen py-10 px-4 flex justify-center self-center w-full max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full h-fit">
        {/* Left side: Listing details */}
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>
              <p className="text-2xl">{listing.name}</p>
              <div className="text-lg text-muted-foreground mt-1 flex items-center space-x-2">
                <IconBuilding size={20} />
                <p>{listing.organization.name}</p>
              </div>
            </CardTitle>
            <CardDescription className="text-lg">{listing.description}</CardDescription>
          </CardHeader>
          <CardContent className="text-lg flex flex-col text-left space-y-2">
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
          <CardFooter className="mt-auto flex space-x-5">
            {user && (
              <Link href={applied ? '' : `/listing/${id}/apply`}>
                <Button size={'lg'} className="cursor-pointer" disabled={applied}>
                  {!applied ? (
                    <>
                      Apply
                      <IconArrowRight />
                    </>
                  ) : (
                    <>Applied</>
                  )}
                </Button>
              </Link>
            )}

            {user && in_org && (
              <Link href={`/listing/${id}/manage`}>
                <Button size={'lg'} className="cursor-pointer">
                  Manage
                  <IconSettings />
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>
        {/* Right side: Map */}
        <Card className="relative z-10">
          <CardHeader>
            <CardTitle className="text-2xl">Location</CardTitle>
            <CardDescription className="flex space-x-2 items-center">
              <IconMapPin size={20} />
              <p>
                {listing.organization.address} {listing.organization.postcode}
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] w-full">
            {listing.organization.address && listing.organization.postcode ? (
              <MapWrapper
                address={listing.organization.address}
                postcode={listing.organization.postcode}
              />
            ) : (
              <div className="flex flex-col justify-center self-center items-center space-y-5 bg-accent size-full">
                <IconMapCancel size={60} />
                <p className="text-xl">Location not available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
