'use client';

import { ApplicationStatus, ListingStatus, Prisma } from '@/../generated/prisma_client';
import { DistributePointsFor, SetApplicationStatus, SetListingStatus } from './actions';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconBan, IconCheck } from '@tabler/icons-react';
import { Separator } from '@/components/ui/separator';

export type ListingWithApplications = Prisma.ListingGetPayload<{
  include: { applications: { include: { user: true } } };
}>;

export type ApplicationWithUsers = Prisma.ApplicationGetPayload<{
  include: { user: true };
}>;

/**
 * This component delivers functions to manage listings
 * @param {{listing: ListingWithApplications}} param0  Object containing listing
 * @param {ListingWithApplications} param0.listing The listing to manage
 * @returns {Element} The component
 */
export function ListingManagement({ listing }: { listing: ListingWithApplications }) {
  return (
    <Card className="p-6 bg-accent text-accent-foreground">
      <h1 className="font-semibold text-2xl">Listing Details</h1>
      <h2>
        <span className="font-semibold">Status: </span>
        {(listing.status === 'acceptingApplications' && 'Accepting applications') ||
          (listing.status === 'applicationsClosed' && 'Closed') ||
          (listing.status === 'cancelled' && 'Cancelled') ||
          (listing.status === 'completed' && 'Completed')}
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <ApplicationList listing={listing} />
        </CardContent>
      </Card>

      <CardFooter className="p-0 gap-5 flex flex-col sm:flex-row self-start items-start">
        {listing.status === 'acceptingApplications' ? (
          <Button
            variant={'destructive'}
            className="w-fit cursor-pointer"
            onClick={async () => {
              await SetListingStatus(listing.id, ListingStatus.applicationsClosed);
            }}
          >
            Close applications
            <IconBan />
          </Button>
        ) : (
          <Button
            className="w-fit cursor-pointer"
            onClick={async () => {
              await SetListingStatus(listing.id, ListingStatus.applicationsClosed);
            }}
          >
            Re-open applications
          </Button>
        )}

        <Button
          variant={'destructive'}
          className="w-fit cursor-pointer"
          onClick={async () => {
            await SetListingStatus(listing.id, ListingStatus.cancelled);
          }}
          disabled={listing.status === 'cancelled'}
        >
          Cancel Listing
        </Button>
        <Button
          className="w-fit cursor-pointer"
          onClick={async () => {
            await SetListingStatus(listing.id, ListingStatus.completed);
            await DistributePointsFor(listing.id);
          }}
          disabled={listing.status === 'cancelled'}
        >
          Mark as complete
          <IconCheck />
        </Button>
      </CardFooter>
    </Card>
  );
}

/**
 * This component shows a list of applications and methods to interact with them
 * @param {{listing: ListingWithApplications}} param0  Object containing listing
 * @param {ListingWithApplications} param0.listing The listing to manage
 * @returns {Element} The component
 */
export function ApplicationList({ listing }: { listing: ListingWithApplications }) {
  return (
    <ul className="flex flex-col space-y-5">
      {listing.applications.map((application, key) => (
        <li key={key}>
          <PresentApplication application={application} />
          <Separator className="mt-5" />
        </li>
      ))}
    </ul>
  );
}

/**
 * This component is used to display the listing information on the listing page
 * @param {ApplicationWithUsers} param0 - Accepts an object with a listing object
 * @returns {Element} - Returns HTML component that displays the listing information
 */
export function PresentApplication({ application }: { application: ApplicationWithUsers }) {
  return (
    <div className="flex flex-col space-y-2">
      <div>
        <h3>
          <span className="font-medium">Username: </span>
          {application.user.username}
        </h3>
        <h3>
          <span className="font-medium">Status: </span>
          {application.status}
        </h3>
        <p>
          <span className="font-medium">Message: </span>
          <br />
          {application.description ?? 'No comment'}
        </p>
      </div>
      <div className="flex space-x-5">
        {application.status === ApplicationStatus.PENDING ? (
          <>
            <Button
              size={'sm'}
              className="cursor-pointer"
              onClick={() => SetApplicationStatus(application.id, ApplicationStatus.ACCEPTED)}
            >
              Accept
            </Button>
            <Button
              variant={'destructive'}
              size={'sm'}
              className="cursor-pointer"
              onClick={() => SetApplicationStatus(application.id, ApplicationStatus.REJECTED)}
            >
              Reject
            </Button>
          </>
        ) : (
          <Button
            className="cursor-pointer"
            size={'sm'}
            variant={'secondary'}
            onClick={() => SetApplicationStatus(application.id, ApplicationStatus.PENDING)}
          >
            Undo
          </Button>
        )}
      </div>
    </div>
  );
}
