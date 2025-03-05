import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

interface ListingPageProps {
  params: { id?: string };
}

export default async function ListingPage({ params }: ListingPageProps) {

  const { id } = await params;  // Await params to get its properties

  if (!id) {
    return notFound();
  }


  const listingId = parseInt(id, 10);
  if (isNaN(listingId)) {
    return notFound();
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { organization: true },
  });

  if (!listing) return notFound(); 

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{listing.name}</h1>
      <p className="text-gray-700">{listing.description}</p>
      <p className="text-gray-500">
        {new Date(listing.startDateTime).toLocaleDateString()} -{" "}
        {new Date(listing.endDateTime).toLocaleDateString()}
      </p>
      <p className="text-gray-600">
        Organization: {listing.organization?.name || "Unknown"}
      </p>
    </div>
  );
}
