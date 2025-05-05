import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import prisma, { signupComplete } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListingStatus } from '../../../../generated/prisma_client';
import { GetUser } from '@/lib/prisma';
import FollowButton from '@/components/FollowButton';
import ListingInfo from '@/components/listingInfo';

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
    const signupCompleted = await signupComplete();
    if (!signupCompleted) {
      redirect('/user/sign-up');
    }
  }

  // Include followers in the org query for the FollowButton logic
  const org = await prisma.organization.findUnique({
    where: {
      id: org_id,
    },
    include: {
      followers: true, // <-- include followers
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

  return (
    <div className="p-5 sm:p-10 md:p-20 lg:px-40 xl:px-80 space-y-10">
      <Card className="p-0 overflow-hidden">
        <Card className="relative h-32 md:h-54 bg-primary border-none rounded-none">
          <Avatar className="size-22 md:size-44 absolute top-20 left-10 md:top-30 md:left-20 border-8 border-card">
            <AvatarImage
              src="https://avatars.githubusercontent.com/u/83641209?v=4"
              alt="profile image"
            />
            <AvatarFallback>DM</AvatarFallback>
          </Avatar>
        </Card>
        <CardHeader className="p-5 md:p-10 md:pt-20">
          <CardTitle className="mb-5">
            <p className="text-2xl md:text-3xl font-semibold">{org?.name}</p>
            <p className="text-md md:text-lg text-muted-foreground">Category ⋅ {org?.address}</p>
          </CardTitle>

          {/* ✅ Follow/Unfollow Button */}
          {user && org?.followers && (
            <div className="mt-2">
              <FollowButton
                organizationId={org.id}
                isFollowing={org.followers.some((f) => f.userId === user.id)}
              />
            </div>
          )}

          <CardDescription>
            <p className="text-md md:text-lg font-medium line-clamp-3"> {org?.description} </p>
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
