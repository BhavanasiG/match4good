import type { Listing } from '../../generated/prisma_client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import Link from 'next/link';
import { Button } from './ui/button';
import prisma from '@/lib/prisma';

/**
 *
 * @param {Date} startDate - Accepts a Date object representing the start date of the listing
 * @param {Date} endDate - Accepts a Date object representing the end date of the listing
 * @returns {string} - Returns a formatted string
 * This component is used to format a date string for the listing card component.
 */
function getTimeString(startDate: Date, endDate: Date) {
  const difference: Date = new Date(endDate.getTime() - startDate.getTime());
  const hours: number = Math.floor(difference.getTime() / (1000 * 60 * 60));

  if (startDate.getDate() === endDate.getDate()) {
    return (
      <>
        <p>{startDate.toLocaleDateString(undefined, { dateStyle: 'full' })}</p>
        <p>
          {startDate.toLocaleTimeString(undefined, { timeStyle: 'short' })} -&nbsp;
          {endDate.toLocaleTimeString(undefined, { timeStyle: 'short' })}
        </p>
      </>
    );
  } else if (hours < 168) {
    return (
      <p>
        {startDate.toLocaleDateString(undefined, { dateStyle: 'full' })} -&nbsp;
        {endDate.toLocaleDateString(undefined, { dateStyle: 'full' })}
      </p>
    );
  } else {
    return (
      <p>
        {startDate.toLocaleDateString(undefined, { dateStyle: 'long' })} -&nbsp;
        {endDate.toLocaleDateString(undefined, { dateStyle: 'long' })}
      </p>
    );
  }
}

/**
 *
 * @param {Listing} param0 - Accepts an object with a listing object
 * @returns {Element} - Returns HTML component that displays the listing information
 * This component is used to display the listing information on the listing page
 */
export default async function ListingInfo({ listing }: { listing: Listing }) {
  const listingOrg = await prisma.organization.findUnique({
    where: {
      id: listing.organizationId,
    },
  });

  if (!listingOrg) {
    return <></>;
  }

  return (
    <div className="w-full">
      <Card className="hover:shadow-lg hover:shadow-gray-300 transition-shadow duration-100 ease-in-out h-full flex flex-col justify-between">
        <CardHeader>
          <CardTitle>
            <p className="text-lg">{listing.name}</p>
            <p className="text-sm text-muted-foreground mt-1">{listingOrg.name}</p>
          </CardTitle>
          <CardDescription className="line-clamp-3">{listing.description}</CardDescription>
        </CardHeader>
        <CardContent className="text-base">
          {getTimeString(listing.startDatetime, listing.endDatetime)}
        </CardContent>
        <CardFooter>
          <Link href={`/listing/${listing.id}`}>
            <Button className="cursor-pointer">View Details</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
