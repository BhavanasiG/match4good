import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { CommonAvatar } from '@/app/settings/profileImageUpload';
import Image from 'next/image';
import { IconEdit } from '@tabler/icons-react';

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
    },
  });

  const listings = await prisma.listing.findMany({
    where: {
      organizationId: org_id,
    },
  });

  if (org === null) {
    notFound();
  }

  const region = await prisma.region.findUnique({
    where: {
      id: org.regionId || undefined,
    },
  });

  return (
    <div className="p-5 md:p-24 space-y-5 w-screen max-w-5xl flex flex-col justify-center self-center">
      <Card className="p-0 w-full max-w-5xl self-center">
        <div className="flex items-center relative h-44">
          {org.backgroundPictureUrl ? (
            <Image
              src={org.backgroundPictureUrl}
              alt={`${org.name} background image`}
              fill
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="size-full bg-accent p-10 items-center self-center flex justify-center">
              <Image src={'/logo_extended.svg'} width={393} height={73} alt="default image" />
            </div>
          )}

          <CommonAvatar
            src={org.profilePictureUrl || ''}
            className="size-28 absolute top-28 left-10 md:top-30 md:left-20 border-4 border-card"
          />
        </div>
        <CardHeader className="mt-10">
          <CardTitle className="mb-2">
            <p className="text-2xl md:text-3xl font-semibold">{org?.name}</p>
            <p className="text-md md:text-lg text-muted-foreground">{region?.name}</p>
          </CardTitle>
          <CardDescription>
            <p className="text-md md:text-lg font-medium line-clamp-3"> {org?.description} </p>
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center space-x-2 mb-5">
          {/* ✅ Follow/Unfollow Button */}
          {user && org?.followers && (
            <FollowButton
              organizationId={org.id}
              isFollowing={org.followers.some((f) => f.userId === user.id)}
            />
          )}

          {/* ✅ Edit Organization Button (Visible only to owners) */}
          {user?.id === org?.ownerId && (
            <Link href={`/org/${org.id}/edit`} className="cursor-pointer">
              <Button className="cursor-pointer">
                Edit Organization
                <IconEdit />
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
      <Separator className="my-10" />
      <h2 className="text-2xl font-semibold">Listings</h2>
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
