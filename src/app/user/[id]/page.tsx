import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import prisma, { SignupComplete } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListingStatus, Organization } from '../../../../generated/prisma_client';
import { GetUser } from '@/lib/prisma';
import FollowButton from '@/components/FollowButton';
import ListingInfo from '@/components/listingInfo';
import { CommonAvatar } from '@/app/settings/profileImageUpload';
import Image from 'next/image';
import { IconBuilding, IconEdit } from '@tabler/icons-react';
import { use } from 'react';

/* eslint-disable @typescript-eslint/naming-convention */

type t_params = Promise<{ id: string }>;

export default async function App(props: { params: t_params }) {
  const id = parseInt((await props.params).id);

  if (isNaN(id)) {
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
  const account = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      ownerOf: true,
      memberOf: true,
    },
  });

  if (!account) {
    return notFound();
  }

  return (
    <div className="p-5 md:p-24 space-y-5 w-screen max-w-5xl flex flex-col justify-center self-center">
      <Card className="p-0 w-full max-w-5xl self-center">
        <div className="flex items-center relative h-44">
          {account.backgroundPictureUrl ? (
            <Image
              src={account.backgroundPictureUrl}
              alt={`${account?.username} background image`}
              fill
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="size-full bg-accent p-10 items-center self-center flex justify-center">
              <Image src={'/logo_extended.svg'} width={393} height={73} alt="default image" />
            </div>
          )}

          <CommonAvatar
            src={account.profilePictureUrl || ''}
            className="size-28 absolute top-28 left-10 md:top-30 md:left-20 border-4 border-card"
          />
        </div>
        <CardHeader className="mt-10">
          <CardTitle className="mb-2">
            <p className="text-2xl md:text-3xl font-semibold">{account.username}</p>
          </CardTitle>
          <CardDescription>
            <p className="text-md md:text-lg font-medium line-clamp-3"> {account.bio} </p>
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center space-x-2 mb-5">
          {/* ✅ Edit User Button (Visible only to user) */}
          {user?.id === account.id && (
            <Link href={`/settings`} className="cursor-pointer">
              <Button className="cursor-pointer">
                Edit User
                <IconEdit />
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
      <Separator className="my-10" />
      <h2 className="text-2xl font-semibold">Organizations</h2>
      <Tabs defaultValue="owned" className="w-full">
        <TabsList className="grid grid-cols-2 mb-5 size-fit w-full">
          <TabsTrigger value="owned" className="cursor-pointer text-md">
            Owned organizations
          </TabsTrigger>
          <TabsTrigger value="member" className="cursor-pointer text-md">
            Member of
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="owned"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 w-full h-fit"
        >
          {account.ownerOf.length === 0 ? (
            <div className="w-full justify-center items-center flex">
              <p className="text-lg font-medium">No owned organizations</p>
            </div>
          ) : (
            account.ownerOf.map((org) => <OrgInfo key={org.id} org={org} />)
          )}
        </TabsContent>
        <TabsContent
          value="member"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 w-full"
        >
          {account.memberOf.length === 0 ? (
            <div className="w-full justify-center items-center flex">
              <p className="text-lg font-medium">No joined organizations</p>
            </div>
          ) : (
            account.memberOf.map((org) => <OrgInfo key={org.id} org={org} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OrgInfo({ org }: { org: Organization }) {
  return (
    <div className="w-full">
      <Card className="hover:shadow-lg hover:shadow-gray-300 transition-shadow duration-100 ease-in-out h-full flex flex-col justify-between">
        <CardHeader>
          <CardTitle>
            <div className="text-base text-muted-foreground mt-1 flex items-center space-x-2">
              <IconBuilding size={25} />
              <p>{org.name}</p>
            </div>
          </CardTitle>
          <CardDescription className="line-clamp-3">{org.description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href={`/org/${org.id}`}>
            <Button className="cursor-pointer">View Organization</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
