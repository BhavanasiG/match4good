import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id: parseInt(id) },
    include: { organization: true },
  });

  if (!listing) return notFound();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{listing.name}</h1>
      <p className="text-gray-700">{listing.description}</p>
      <p className="text-gray-500">
        {new Date(listing.start_datetime).toLocaleDateString()} -{" "}
        {new Date(listing.end_datetime).toLocaleDateString()}
      </p>
      <p className="text-gray-600">
        Organization: {listing.organization?.name || "Unknown"}
      </p>
    </div>
  );
}
