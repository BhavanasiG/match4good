import { Prisma } from '../../generated/prisma_client';

export type ListingWithOrganization = Prisma.ListingGetPayload<{
  include: { organization: true };
}>;

/**
 *
 * @param {ListingWithOrganization} param0 - Accepts an object with a listing object
 * @returns {Element} - Returns HTML component that displays the listing information
 * This component is used to display the listing information on the listing page
 */
export default function ListingInfo({ listing }: { listing: ListingWithOrganization }) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{listing.name}</h1>
      <p className="text-gray-700">{listing.description}</p>
      <p className="text-gray-500">
        {new Date(listing.startDatetime).toLocaleDateString()} -{' '}
        {new Date(listing.endDatetime).toLocaleDateString()}
      </p>
      <p className="text-gray-600">Organization: {listing.organization?.name || 'Unknown'}</p>
    </div>
  );
}
