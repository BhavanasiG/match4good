import prisma from "@/lib/prisma";

export default async function ListingPage({ params }: { params: { id: string } }) {
  const listing = await prisma.listing.findUnique({
    where: { id: parseInt(params.id) },
    include: { organization: true },
  });

  if (!listing) {
    return <div className="p-8 text-red-500">Listing not found</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">{listing.name}</h1>
      <p>{listing.description}</p>
      <p className="text-gray-500">
        {new Date(listing.startDateTime).toLocaleDateString()} - {new Date(listing.endDateTime).toLocaleDateString()}
      </p>
      <p className="text-gray-600">Organization: {listing.organization?.name}</p>
    </div>
  );
}
