import prisma, { GetUser } from '@/lib/prisma';
import { forbidden, notFound } from 'next/navigation';
import { CloseApplications, ListingWithApplications, PresentApplication } from './client';
import ListingInfo from '@/components/listingInfo';
import { ListingStatus } from '@/../generated/prisma_client';

function Applicants({ listing }: { listing: ListingWithApplications }) {
  return (
    <div>
      <h2>Pending Applications</h2>
      <ul>
        {listing.applications.map((application, i) => (
          <li key={i}>
            <PresentApplication application={application} />
          </li>
        ))}
      </ul>

      {listing.status === ListingStatus.acceptingApplications && (
        <CloseApplications listing={listing} />
      )}
    </div>
  );
}

export default async function App({ params }: { params: Promise<{ id: string }> }) {
  const user = await GetUser(true);

  if (!user) {
    return forbidden();
  }

  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id: parseInt(id) },
    include: {
      applications: { include: { user: true } },
      organization: true,
    },
  });
  console.log(listing);
  if (!listing) {
    return notFound();
  }

  if (
    !user.memberOf.some((org) => org.id === listing.organizationId) &&
    !user.ownerOf.some((org) => org.id === listing.organizationId)
  ) {
    return forbidden();
  }

  return (
    <span className="grid grid-cols-2">
      <div className="">
        <ListingInfo listing={listing} />
      </div>
      <div className="">
        <Applicants listing={listing} />
      </div>
    </span>
  );
}
