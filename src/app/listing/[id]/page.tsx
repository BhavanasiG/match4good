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
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] to-[#f1f8e9] py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left side: Listing details */}
          <div className="flex flex-col space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🤝</span>
                <h1 className="text-3xl font-extrabold text-[#388e3c]">{listing.name}</h1>
              </div>
              <ListingInfo listing={listing} />

              <div className="mt-8 flex flex-col gap-4">
                {user && !applied && (
                  <Link
                    href={`/listing/${id}/apply`}
                    className="inline-block bg-gradient-to-r from-[#4CAF50] to-[#81C784] text-white px-6 py-3 rounded-full text-center font-semibold hover:from-[#388e3c] hover:to-[#66bb6a] transition"
                  >
                    Apply Now
                  </Link>
                )}
                {user && applied && (
                  <p className="text-[#388e3c] font-semibold flex items-center gap-2">
                    <span className="text-xl">✅</span>
                    You&apos;ve already applied for this opportunity!
                  </p>
                )}
                {user && in_org && (
                  <Link
                    href={`/listing/${id}/manage`}
                    className="inline-block bg-gradient-to-r from-[#388e3c] to-[#81C784] text-white px-6 py-3 rounded-full text-center font-semibold hover:from-[#2e7031] hover:to-[#66bb6a] transition"
                  >
                    Manage Listing
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Right side: Map */}
          <div className="flex flex-col space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col h-full">
              <h2 className="text-2xl font-bold text-[#388e3c] mb-4 flex items-center gap-2">
                <span>📍</span> Location
              </h2>
              {listing.organization?.address && listing.organization?.postcode ? (
                <div className="flex-grow min-h-[400px] relative rounded-lg overflow-hidden border border-[#c8e6c9]">
                  <MapComponent
                    address={listing.organization.address}
                    postcode={listing.organization.postcode}
                  />
                </div>
              ) : (
                <p className="text-gray-500">Location not available.</p>
              )}
              {listing.organization?.name && (
                <div className="mt-6 text-sm text-gray-700">
                  <span className="font-semibold text-[#388e3c]">Organization:</span>{' '}
                  {listing.organization.name}
                </div>
              )}
              {listing.organization?.address && (
                <div className="text-sm text-gray-700">
                  <span className="font-semibold text-[#388e3c]">Address:</span>{' '}
                  {listing.organization.address}
                </div>
              )}
              {listing.organization?.postcode && (
                <div className="text-sm text-gray-700">
                  <span className="font-semibold text-[#388e3c]">Postcode:</span>{' '}
                  {listing.organization.postcode}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
