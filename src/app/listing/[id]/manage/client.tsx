'use client';

import { ApplicationStatus, ListingStatus, Prisma } from '@/../generated/prisma_client';
import { DistributePointsFor, SetApplicationStatus, SetListingStatus } from './actions';

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
    <div>
      {listing.status === ListingStatus.acceptingApplications ? (
        <>
          <h2>This listing is accepting applications</h2>
          <ApplicationList listing={listing} />
          <button
            onClick={async () => {
              await SetListingStatus(listing.id, ListingStatus.applicationsClosed);
            }}
          >
            Close applications
          </button>
          <br />
        </>
      ) : (
        <>
          <h2>This listing is not accepting applications</h2>
          <button
            onClick={async () => {
              await SetListingStatus(listing.id, ListingStatus.acceptingApplications);
            }}
          >
            Reopen applications
          </button>
          <br />
        </>
      )}

      {listing.status === ListingStatus.cancelled ? (
        <h2>This listing has been cancelled</h2>
      ) : (
        <>
          <button
            onClick={async () => {
              await SetListingStatus(listing.id, ListingStatus.cancelled);
            }}
          >
            Cancel listing
          </button>
          <br />
        </>
      )}

      {listing.status === ListingStatus.completed ? (
        <h2>This listing has been completed</h2>
      ) : (
        <>
          <button
            onClick={async () => {
              await SetListingStatus(listing.id, ListingStatus.completed);
              await DistributePointsFor(listing.id);
            }}
          >
            Mark listing as complete
          </button>
          <br />
        </>
      )}
    </div>
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
    <ul>
      {listing.applications.map((application, key) => (
        <li key={key}>
          <PresentApplication application={application} />
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
