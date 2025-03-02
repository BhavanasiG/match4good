import Link from "next/link";

async function getListings() {
  const res = await fetch("http://localhost:3000/api/listing", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch listings");
  return res.json();
}

export default async function ListingsPage() {
  const listings = await getListings();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Volunteer Opportunities</h1>
      <ul>
        {listings.map((listing: any) => (
          <li key={listing.id} className="border p-4 mb-2 rounded-lg">
            <h2 className="text-xl font-semibold">{listing.name}</h2>
            <p>{listing.description}</p>
            <p className="text-gray-500">
              {new Date(listing.startDateTime).toLocaleDateString()} - {new Date(listing.endDateTime).toLocaleDateString()}
            </p>
            <p className="text-gray-600">Organization: {listing.organization?.name}</p>
            <Link href={`/listing/${listing.id}`} className="text-blue-500 underline">
              View Details
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
