import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import prisma, { SignupComplete } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListingStatus } from '../../../../generated/prisma_client';
import { GetUser } from '@/lib/prisma';
import FollowButton from '@/components/FollowButton';
import ListingInfo from '@/components/listingInfo';

import { OrganizationWithSelectedRelations } from '@/lib/prisma';
import { UserIcon } from 'lucide-react';
/* eslint-disable @typescript-eslint/naming-convention */

type t_params = Promise<{ id: string }>;

export default async function App(props: { params: t_params }) {
  const org_id = parseInt((await props.params).id);

  if (isNaN(org_id)) {
    return notFound();
  }

  // Get the current user
  const user = await GetUser(true);

  if (user) {
    const signupCompleted = await SignupComplete();
    if (!signupCompleted) {
      redirect('/user/sign-up');
    }
  }

  // Include followers and owner in the org query for permissions & buttons
  const org = await prisma.organization.findUnique({
    where: {
      id: org_id,
    },
    include: {
      followers: true, // Include followers for FollowButton logic
      owner: true, // Include owner for Edit button logic
      Region: true, // Include region for displaying region name
    },
  });

  const listings = await prisma.listing.findMany({
    where: {
      organizationId: org_id,
    },
    include: { organization: true, categories: true },
  });

  if (org === null) {
    notFound();
  }

  const isFollowing = user && org.followers.some((f) => f.userId === user.id);
  const isOwner = user && org.ownerId === user.id; // Check if the user is the owner

  return (
    <div className="p-5 sm:p-10 md:p-20 lg:px-40 xl:px-80 space-y-10">
      {/* --- Organization Header Section --- */}
      <Card className="p-0 overflow-hidden relative">
        {/* Banner Picture Area */}
        <div className="w-full h-32 md:h-54 bg-gray-200 relative">
          {' '}
          {/* Placeholder background */}
          {org.bannerPictureUrl ? (
            <Image
              src={org.bannerPictureUrl}
              alt={`${org.name} banner`}
              fill
              className="object-cover"
            />
          ) : (
            // Fallback if no banner picture
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Banner Image
            </div>
          )}
        </div>

        {/* Profile Picture Avatar */}
        <Avatar className="size-22 md:size-44 absolute top-20 left-10 md:top-30 md:left-20 border-8 border-card z-10">
          {' '}
          {/* z-10 ensures it's above other content */}
          {org.orgPictureUrl ? (
            // Use next/image for optimized profile picture inside Avatar
            <Image
              src={org.orgPictureUrl}
              alt={`${org.name} profile`}
              width={176}
              height={176}
              className="object-cover rounded-full"
            />
          ) : (
            // Fallback if no profile picture
            <AvatarFallback className="size-full flex justify-center items-center bg-gray-200 text-gray-500">
              <UserIcon className="size-1/2" /> {/* Placeholder icon */}
            </AvatarFallback>
          )}
        </Avatar>

        {/* Organization Info Area */}
        <CardHeader className="p-5 md:p-10 pt-12 md:pt-20 lg:pt-24 xl:pt-32">
          {' '}
          <CardTitle className="mb-4">
            <p className="text-2xl md:text-3xl font-semibold">{org?.name}</p>{' '}
            <p className="text-md md:text-base text-muted-foreground">
              Address : {org?.address}, {org?.postcode}{' '}
            </p>
            <p className="text-md md:text-base text-muted-foreground">
              Region : {org?.Region?.name}
            </p>
          </CardTitle>
          <div className="flex items-center space-x-2 mt-2">
            {/* Follow/Unfollow Button */}
            {user &&
              org && ( // Ensure user and org exist before rendering
                <FollowButton
                  organizationId={org.id}
                  isFollowing={isFollowing ?? false} // Use the derived isFollowing state with a fallback
                />
              )}

            {/* Edit Organization Button (Visible only to owners) */}
            {isOwner && ( // Use the derived isOwner state
              <Link href={`/org/${org.id}/edit`}>
                <Button variant="secondary">Edit Organization</Button>
              </Link>
            )}
          </div>
          <CardDescription>
            <p className="text-md md:text-base font-medium line-clamp-3">
              {' '}
              {org?.description}{' '}
            </p>{' '}
          </CardDescription>
        </CardHeader>
      </Card>

      <Separator className="my-10 md:my-20" />

      <h2 className="text-3xl font-semibold">Listings</h2>
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid grid-cols-2 mb-5 size-fit w-full">
          <TabsTrigger value="active" className="cursor-pointer text-md">
            Active
          </TabsTrigger>
          <TabsTrigger value="inactive" className="cursor-pointer text-md">
            Inactive
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="active"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 w-full h-fit"
        >
          {listings.length === 0 ? (
            <div className="w-full justify-center items-center flex">
              <p className="text-lg font-medium">No active listings</p>
            </div>
          ) : (
            listings.map((listing) => {
              if (listing.status == ListingStatus.acceptingApplications) {
                return <ListingInfo key={listing.id} listing={listing} />;
              }
            })
          )}
        </TabsContent>
        <TabsContent
          value="inactive"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 w-full"
        >
          {listings.length === 0 ? (
            <div className="w-full justify-center items-center flex">
              <p className="text-lg font-medium">No inactive listings</p>
            </div>
          ) : (
            listings.map((listing) => {
              if (listing.status != ListingStatus.acceptingApplications) {
                return <ListingInfo key={listing.id} listing={listing} />;
              }
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
