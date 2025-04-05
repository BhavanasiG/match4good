import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* eslint-disable @typescript-eslint/naming-convention */

function getTimeString(start_date : Date, end_date : Date) {
  const difference : Date = new Date(end_date.getTime() - start_date.getTime());
  const hours : number = Math.floor(difference.getTime() / (1000 * 60 * 60));

  if (start_date.getDate() === end_date.getDate()) {
    return (
      <>
        <p>
          {start_date.toLocaleDateString(undefined, {dateStyle: "full"})}
        </p>
        <p>
          {start_date.toLocaleTimeString(undefined, {timeStyle: "short"})} -&nbsp; 
          {end_date.toLocaleTimeString(undefined, {timeStyle: "short"})}
        </p>
      </>
    )
  } else if (hours < 168) {
    return (
      <p>
        {start_date.toLocaleDateString(undefined, {dateStyle: "full"})} -&nbsp;
        {end_date.toLocaleDateString(undefined, {dateStyle: "full"})}
      </p>
    )
  } else {
    return (
      <p>
        {start_date.toLocaleDateString(undefined, {dateStyle: "long"})} -&nbsp;
        {end_date.toLocaleDateString(undefined, {dateStyle: "long"})}
      </p>
    )
  }
}

type t_params = Promise<{ id: string }>;

export default async function App(props: {params: t_params}) {
  const org_id: number = Number((await props.params).id);

  const org = await prisma.organization.findUnique({
    where: {
      id: org_id,
    }
  });

  const listings = await prisma.listing.findMany({
    where: {
      organization_id: org_id,
    }
  })

  if (org === null) {
    notFound();
  }

  return (
    <div className="p-20 px-80 space-y-10">
      <Card className="p-0 overflow-hidden">
        <Card className="relative h-54 bg-primary border-none rounded-none">
          <Avatar className="size-44 absolute top-30 left-20 border-4 border-secondary">
            <AvatarImage src="https://avatars.githubusercontent.com/u/83641209?v=4" alt="profile image"/>
            <AvatarFallback>DM</AvatarFallback>
          </Avatar>
        </Card>
        <CardHeader className="p-10 pt-20">
          <CardTitle className="mb-5">
            <p className="text-3xl font-semibold">{org?.name}</p>
            <p className="text-lg text-muted-foreground">Category ⋅ Location</p>
          </CardTitle>
          <CardDescription>
            <p className="text-lg font-medium line-clamp-3"> {org?.description} </p>
          </CardDescription>
        </CardHeader>
      </Card>
      <Separator className="my-20" />
      <h2 className="text-3xl font-semibold">Listings</h2>
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid grid-cols-2 mb-5 size-fit w-full">
          <TabsTrigger value="active" className="cursor-pointer text-md">Active</TabsTrigger>
          <TabsTrigger value="inactive" className="cursor-pointer text-md">Inactive</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="grid grid-cols-3 gap-5 w-full">
          {listings.map((listing) => (
            <Card key={listing.id} className="basis-1/3">
              <CardHeader>
                <CardTitle>
                  <p>{listing.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">Location</p>
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {listing.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-base">
                {(listing.start_datetime.getDate() === listing.end_datetime.getDate()) ? (
                  <>
                    <p>
                      {listing.start_datetime.toLocaleDateString(undefined, {dateStyle: "full"})}
                    </p>
                    <p>
                      {listing.start_datetime.toLocaleTimeString(undefined, {timeStyle: "short"})} -&nbsp; 
                      {listing.end_datetime.toLocaleTimeString(undefined, {timeStyle: "short"})}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      {listing.start_datetime.toLocaleDateString(undefined, {dateStyle: "full"})} -&nbsp;
                      {listing.end_datetime.toLocaleDateString(undefined, {dateStyle: "full"})}
                    </p>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Link href={`/listing/${listing.id}`}>
                  <Button className="cursor-pointer">
                    View Listing
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
      <Separator className="my-10" />
    </div>
  )
}
