import prisma from '@/lib/prisma';
import Link from 'next/link';

// Fetch listings directly from the database
export default async function ListingsPage() {
  const listings = await prisma.listing.findMany({
    include: {
      organization: true, // Fetch organization details
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Volunteer Opportunities</h1>
      <ul>
        {listings.length > 0 ? (
          listings.map((listing) => (
            <li key={listing.id} className="border p-4 mb-2 rounded-lg">
              <h2 className="text-xl font-semibold">{listing.name}</h2>
              <p>{listing.description}</p>
              <p className="text-gray-500">
                {listing.startDatetime?.toLocaleDateString()} -{' '}
                {listing.endDatetime?.toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                Organization: {listing.organization?.name || 'Unknown'}
              </p>
              <Link href={`/listing/${listing.id}`} className="text-blue-500 underline">
                View Details
              </Link>
            </li>
          ))
        ) : (
          <p>No opportunities available.</p>
        )}
      </ul>
    </div>
  );
}
