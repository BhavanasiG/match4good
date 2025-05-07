import ListingInfo from '@/components/listingInfo';
import { Button } from '@/components/ui/button';
import { siteContent } from '@/config/siteConfig';
import { auth0 } from '@/lib/auth0';
import prisma, { GetUser } from '@/lib/prisma';
import { IconArrowRight, IconBulb, IconGlobe, IconHeartHandshake } from '@tabler/icons-react';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function SessionButton() {
  const session = await auth0.getSession();

  if (session) {
    return <></>;
  } else {
    return (
      <Link href={'/listings/'}>
        <Button variant={'secondary'} className="cursor-pointer" size={'lg'}>
          Join us
          <IconArrowRight />
        </Button>
      </Link>
    );
  }
}
export default async function App() {
  const user = await GetUser();

  // If the user is logged in (user is not null), check their signup status
  if (user) {
    // If signup is not completed, and they are not already on the signup page, redirect them.
    // We check the current path to avoid an infinite redirect loop
    // Await the headersListPromise to get the ReadonlyHeaders object
    const headersList = await headers();
    const currentPath = headersList.get('x-invoke-path') || headersList.get('x-pathname'); // Get the current path

    if (!user.signupCompleted && currentPath !== '/user/sign-up') {
      redirect('/user/sign-up');
    }

    // If signup is completed or user is already on signup page,
    // continue rendering the home page content below.
  }

  // If the user is not logged in, or if they are logged in and signup is complete,
  // render the content of the home page.

  const recentListings = await prisma.listing.findMany({
    where: {
      status: 'acceptingApplications',
    },
    take: 4,
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/** Hero */}
      <section className="flex flex-col md:flex-row md:h-120">
        <div className="flex items-center basis-4/7 overflow-hidden relative">
          <Image
            src={'/hero-background.jpg'}
            alt="Hero Image"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="flex flex-col bg-primary justify-center items-left p-12 basis-3/7 space-y-10">
          <Image
            src={'/logo_extended_white.svg'}
            width={392}
            height={73}
            alt="Match4Good logo"
            className="hidden md:block"
          />
          <h2 className="text-2xl text-primary-foreground">{siteContent.tagLine}</h2>
          <div className="flex space-x-5">
            <SessionButton />
          </div>
        </div>
      </section>
      {/** Recent listings */}
      <section className="flex flex-col p-12 md:p-24 xl:px-40 space-y-10">
        <h2 className="text-3xl text-primary font-semibold mb-10">Upcoming Opportunities</h2>
        <div className="grid grid-rows-4 sm:grid-rows-2 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-none gap-10">
          {recentListings.map((listing) => (
            <ListingInfo key={listing.id} listing={listing} />
          ))}
        </div>
        <Link href={'/listing/'}>
          <Button variant={'secondary'} className="cursor-pointer" size={'lg'}>
            View all opportunities
            <IconArrowRight />
          </Button>
        </Link>
      </section>
      {/** Organisation Subhero */}
      <section className="flex flex-col md:flex-row md:h-80 overflow-hidden">
        <div className="flex flex-col bg-primary justify-center items-left p-12 basis-3/7 space-y-10">
          <h2 className="text-xl lg:text-2xl xl:text-3xl text-primary-foreground">
            {siteContent.orgDescription}
          </h2>
          <div className="flex space-x-5">
            <Link href={'/org/'}>
              <Button variant={'secondary'} className="cursor-pointer" size={'lg'}>
                Meet our partnering organizations
                <IconArrowRight />
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex items-center basis-4/7 overflow-hidden relative">
          <Image
            src={'/subhero-background.jpg'}
            alt="Hero Image"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      </section>
      {/** Leaderboard */}
      <section className="flex flex-col md:flex-row md:h-80 overflow-hidden">
        <div className="flex items-center basis-4/7 overflow-hidden relative">
          <Image
            src={'/leaderboard-background.jpg'}
            alt="Hero Image"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="flex flex-col bg-primary justify-center items-left p-12 basis-3/7 space-y-10">
          <h2 className="text-xl lg:text-2xl xl:text-3xl text-primary-foreground">
            {siteContent.leaderboardDescription}
          </h2>
          <div className="flex space-x-5">
            <Link href={'/leaderboard/'}>
              <Button variant={'secondary'} className="cursor-pointer" size={'lg'}>
                View community leaderboard
                <IconArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/** Mission Statement */}
      <section className="flex flex-col bg-accent text-accent-foreground text-center justify-center p-12 md:p-16 lg:p-24 xl:px-80 space-y-10">
        <h2 className="text-primary text-2xl md:text-4xl font-semibold">Our Mission</h2>
        <p className="text-base md:text-lg">{siteContent.missionStatement}</p>
      </section>
      {/** Values*/}
      <section className="flex flex-col items-center space-y-5 md:space-y-10 justify-center p-5 md:p-16 lg:p-24 xl:px-80">
        <div className="grid grid-rows-3 md:grid-rows-none md:grid-cols-3 p-8 gap-10 md:gap-20">
          <div className="flex flex-col justify-start items-center space-y-3">
            <IconHeartHandshake size={50} className="text-primary" />
            <h3 className="text-xl font-semibold text-primary">
              {siteContent.coreValues[0].value}
            </h3>
            <p className="text-wrap text-center">{siteContent.coreValues[0].description}</p>
          </div>
          <div className="flex flex-col justify-start items-center space-y-3">
            <IconGlobe size={50} className="text-primary" />
            <h3 className="text-xl font-semibold text-primary">
              {siteContent.coreValues[1].value}
            </h3>
            <p className="text-wrap text-center">{siteContent.coreValues[1].description}</p>
          </div>
          <div className="flex flex-col justify-start items-center space-y-3">
            <IconBulb size={50} className="text-primary" />
            <h3 className="text-xl font-semibold text-primary">
              {siteContent.coreValues[2].value}
            </h3>
            <p className="text-wrap text-center">{siteContent.coreValues[2].description}</p>
          </div>
        </div>
        <Link href={'/about-us'} className="cursor-pointer">
          <Button size={'lg'} className="cursor-pointer">
            Read more about us
            <IconArrowRight />
          </Button>
        </Link>
      </section>
    </div>
  );
}
