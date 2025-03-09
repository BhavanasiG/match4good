import prisma, { getUser } from "@/lib/prisma";
import { forbidden, notFound } from "next/navigation";
import ApplicationForm from "./form";
import ListingInfo from "@/components/listingInfo";

export default async function App({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getUser();

  if (!user) {
    return forbidden();
  }

  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id: parseInt(id) },
    include: { organization: true },
  });

  if (!listing) {
    return notFound();
  }

  return (
    <span className="grid grid-cols-2">
      <div>
        <ListingInfo listing={listing} />
      </div>
      <div className="w-max">
        <ApplicationForm listing_id={listing.id} />
      </div>
    </span>
  );
}
