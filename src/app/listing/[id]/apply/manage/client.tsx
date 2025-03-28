"use client";

import {
  ApplicationStatus,
  Listing,
  ListingStatus,
  Prisma,
} from "@/../generated/prisma_client";
import {
  distributePointsFor,
  setApplicationStatus,
  setListingStatus,
} from "./actions";

export type ListingWithApplications = Prisma.ListingGetPayload<{
  include: { applications: { include: { user: true } } };
}>;

export type ApplicationWithUsers = Prisma.ApplicationGetPayload<{
  include: { user: true };
}>;

/**
 *
 * @param {ApplicationWithUsers} param0 - Accepts an object with a listing object
 * @returns {Element} - Returns HTML component that displays the listing information
 * This component is used to display the listing information on the listing page
 */
export function PresentApplication({
  application,
}: {
  application: ApplicationWithUsers;
}) {
  return (
    <div>
      <div>
        <h3>{application.user.username}</h3>
        <p>
          {application.description ?? "This user did not provide a comment"}
        </p>
      </div>
      <div>
        {application.status === ApplicationStatus.PENDING ? (
          <>
            <button
              onClick={() =>
                setApplicationStatus(application.id, ApplicationStatus.ACCEPTED)
              }
            >
              Accept
            </button>
            <button
              onClick={() =>
                setApplicationStatus(application.id, ApplicationStatus.REJECTED)
              }
            >
              Reject
            </button>
          </>
        ) : (
          <button
            onClick={() =>
              setApplicationStatus(application.id, ApplicationStatus.PENDING)
            }
          >
            Undo
          </button>
        )}
      </div>
    </div>
  );
}

export function CloseApplications({ listing }: { listing: Listing }) {
  return (
    <button
      onClick={async () => {
        await setListingStatus(listing.id, ListingStatus.ApplicationsClosed);
        await distributePointsFor(listing.id);
      }}
    >
      Close Applications
    </button>
  );
}
