import { notFound } from "next/navigation";
import prisma, { getUser } from "@/lib/prisma";
import ListingInfo from "@/components/listingInfo";
import Link from "next/link";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
    <span className="grid grid-cols-2">
      <div className="">
        <ListingInfo listing={listing} />
      </div>
      <div className="">
        {user && !applied && (
          <>
            <Link href={`/listing/${id}/apply`}>Apply now!</Link>
            <br />
          </>
        )}
        {user && applied && <p>{"You've already applied for this!"}</p>}
        {user && in_org && (
          <Link href={`/listing/${id}/manage`}>Manage listing</Link>
        )}
      </div>
    </span>
  );
}
