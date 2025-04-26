import { notFound } from 'next/navigation';
import prisma, { GetUser } from '@/lib/prisma';
import ListingInfo from '@/components/listingInfo';
import MapComponent from '@/components/MapComponent';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingPage({ params }: PageProps) {
  const { id } = await params;

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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side: Listing details */}
        <div className="flex flex-col space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <ListingInfo listing={listing} />

            <div className="mt-6 flex flex-col gap-4">
              {user && !applied && (
                <Link
                  href={`/listing/${id}/apply`}
                  className="inline-block bg-blue-600 text-white px-5 py-3 rounded-lg text-center font-semibold hover:bg-blue-700 transition"
                >
                  Apply Now
                </Link>
              )}
              {user && applied && (
                <p className="text-green-600 font-semibold">
                  You&apos;ve already applied for this opportunity!
                </p>
              )}
              {user && in_org && (
                <Link
                  href={`/listing/${id}/manage`}
                  className="inline-block bg-gray-800 text-white px-5 py-3 rounded-lg text-center font-semibold hover:bg-gray-900 transition"
                >
                  Manage Listing
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Map */}
        <div className="flex flex-col space-y-6">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col h-full">
            <h2 className="text-xl font-semibold mb-4">📍 Location</h2>
            {listing.organization?.address && listing.organization?.postcode ? (
              <div className="flex-grow min-h-[400px] relative rounded-lg overflow-hidden">
                <MapComponent
                  address={listing.organization.address}
                  postcode={listing.organization.postcode}
                />
              </div>
            ) : (
              <p className="text-gray-500">Location not available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
