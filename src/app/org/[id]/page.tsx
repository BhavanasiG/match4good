import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export default async function App() {
  const id : number = 1;

  const org = await prisma.organization.findFirst({
    where: {
      id: id,
    }
  });

  console.log(id, org);

  return (
    <div className="p-20 px-80 space-y-10">
      <Card className="p-0 overflow-hidden">
        <Card className="relative h-54 bg-primary border-none rounded-none">
          <Avatar className="size-44 absolute top-30 left-20 border-4 border-white">
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
            <p className="text-lg font-medium"> {org?.description} </p>
          </CardDescription>
        </CardHeader>
      </Card>
      <Separator className="my-10" />
      <h2 className="text-3xl font-semibold">Listings</h2>
    </div>
  )
}

/*
      <section className="flex flex-col basis-full p-10 px-24">
        <hr className="mb-10" />
        <h1 className="text-2xl font-semibold mx-auto mb-10">Available listings</h1>
        <div className="flex flex-col basis-full border p-10">
          <div className="flex justify-between">
            <h1 className="text-xl font-semibold">Description</h1>
            <p className="font-medium">Start time - End time</p>
          </div>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione fugit minus, blanditiis a nesciunt voluptate soluta et excepturi hic inventore recusandae magnam eum nihil ut facilis at quam error. Tempora.</p>
        </div>
      </section>
*/
