import { Prisma } from "../../generated/prisma_client";

export type ListingWithOrganization = Prisma.ListingGetPayload<{
  include: { organization: true };
}>;

export default function ListingInfo({
  listing,
}: {
  listing: ListingWithOrganization;
}) {
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
