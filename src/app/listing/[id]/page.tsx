import { notFound } from 'next/navigation';
import prisma, { GetUser } from '@/lib/prisma';
import ListingInfo from '@/components/listingInfo';
import MapComponent from '@/components/MapComponent'; // Import the map component
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>; // Update params type to Promise
}

export default async function ListingPage({ params }: PageProps) {
  const { id } = await params; // Await the params because it's now a Promise

  const user = await GetUser(true);

  if (isNaN(parseInt(id))) {
    return notFound();
  }

  const listing = await prisma.listing.findUnique({
    where: { id: parseInt(id) },
    include: { organization: true },
  });

  if (!listing) return notFound();

  const applied =
    user != null
      ? (await prisma.application.count({
          where: { listingId: listing.id, userId: user.id },
        })) > 0
      : false;

  const in_org =
    user != null
      ? user.memberOf.some((org) => org.id === listing.organizationId) ||
        user.ownerOf.some((org) => org.id === listing.organizationId)
      : false;

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Left side: Listing details */}
        <div>
          <ListingInfo listing={listing} />
          {user && !applied && (
            <>
              <Link href={`/listing/${id}/apply`} className="text-blue-500 underline">
                Apply now!
              </Link>
              <br />
            </>
          )}
          {user && applied && (
            <p className="text-green-500">You&apos;ve already applied for this!</p>
          )}
          {user && in_org && (
            <Link href={`/listing/${id}/manage`} className="text-blue-500 underline">
              Manage listing
            </Link>
          )}
        </div>

        {/* Right side: Map */}
        <div className="relative z-10">
          {listing.organization?.address && listing.organization?.postcode ? (
            <MapComponent
              address={listing.organization.address}
              postcode={listing.organization.postcode}
            />
          ) : (
            <p className="text-gray-500">Location not available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
