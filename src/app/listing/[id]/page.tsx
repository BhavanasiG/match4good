import { notFound } from "next/navigation";
import prisma, { getUser } from "@/lib/prisma";
import ListingInfo from "@/components/listingInfo";
import MapComponent from "@/components/MapComponent"; // Import the map component
import Link from "next/link";

export default async function ListingPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const user = await getUser(true);

  const listing = await prisma.listing.findUnique({
    where: { id: parseInt(id) },
    include: { organization: true },
  });

  if (!listing) return notFound();

  // has the user applied for this listing?
  const applied =
    user != null
      ? (await prisma.application.count({
          where: { listing_id: listing.id, user_id: user.id },
        })) > 0
      : false;

  // is the user in the organization?
  const in_org =
    user != null
      ? user.member_of.some((org) => org.id === listing.organization_id) ||
        user.owner_of.some((org) => org.id === listing.organization_id)
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
          {user && applied && <p className="text-green-500">You've already applied for this!</p>}
          {user && in_org && (
            <Link href={`/listing/${id}/manage`} className="text-blue-500 underline">
              Manage listing
            </Link>
          )}
        </div>

        {/* Right side: Map */}
        <div>
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
