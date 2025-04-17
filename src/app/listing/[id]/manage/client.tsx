'use client';

import { ApplicationStatus, Listing, ListingStatus, Prisma } from '@/../generated/prisma_client';
import { DistributePointsFor, SetApplicationStatus, SetListingStatus } from './actions';

export type ListingWithApplications = Prisma.ListingGetPayload<{
  include: { applications: { include: { user: true } } };
}>;

export type ApplicationWithUsers = Prisma.ApplicationGetPayload<{
  include: { user: true };
}>;

/**
 * This component is used to display the listing information on the listing page
 * @param {ApplicationWithUsers} param0 - Accepts an object with a listing object
 * @returns {Element} - Returns HTML component that displays the listing information
 */
export function PresentApplication({ application }: { application: ApplicationWithUsers }) {
  return (
    <div>
      <div>
        <h3>{application.user.username}</h3>
        <p>{application.description ?? 'This user did not provide a comment'}</p>
      </div>
      <div>
        {application.status === ApplicationStatus.PENDING ? (
          <>
            <button
              onClick={() => SetApplicationStatus(application.id, ApplicationStatus.ACCEPTED)}
            >
              Accept
            </button>
            <button
              onClick={() => SetApplicationStatus(application.id, ApplicationStatus.REJECTED)}
            >
              Reject
            </button>
          </>
        ) : (
          <button onClick={() => SetApplicationStatus(application.id, ApplicationStatus.PENDING)}>
            Undo
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Creates an element that allows applications to be closed for a listing
 * @param {{listing: Listing}} params Parameters for the element
 * @returns {Element} Element which allows for closing of applications
 */
export function CloseApplications({ listing }: { listing: Listing }) {
  return (
    <button
      onClick={async () => {
        await SetListingStatus(listing.id, ListingStatus.applicationsClosed);
        await DistributePointsFor(listing.id);
      }}
    >
      Close Applications
    </button>
  );
}
