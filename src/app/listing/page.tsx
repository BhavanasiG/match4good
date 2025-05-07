import prisma, { GetUser, SignupComplete } from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';

// Fetch listings directly from the database
export default async function ListingsPage() {
  const listings = await prisma.listing.findMany({
    include: {
      organization: true, // Fetch organization details
    },
  });

  const user = await GetUser();

  if (user) {
    const signupCompleted = await SignupComplete();
    if (!signupCompleted) {
      redirect('/user/sign-up');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] to-[#f1f8e9] py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-10">
          <div className="text-4xl mb-2">🌱</div>
          <h1 className="text-4xl font-extrabold text-[#388e3c] mb-2">Volunteer Opportunities</h1>
          <p className="text-lg text-[#388e3c] max-w-2xl mx-auto">
            Discover ways to make a difference in your community. Browse our latest volunteering
            opportunities and find your perfect match!
          </p>
        </header>

        {listings.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow border border-green-100"
              >
                <div>
                  <h2 className="text-2xl font-bold text-[#4CAF50] mb-2 flex items-center gap-2">
                    <span role="img" aria-label="Opportunity">
                      🤝
                    </span>
                    {listing.name}
                  </h2>
                  <p className="text-gray-700 mb-3 line-clamp-3">{listing.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-2 gap-2">
                    <span role="img" aria-label="calendar">
                      📅
                    </span>
                    {listing.startDatetime
                      ? new Date(listing.startDatetime).toLocaleDateString()
                      : 'TBA'}
                    {' – '}
                    {listing.endDatetime
                      ? new Date(listing.endDatetime).toLocaleDateString()
                      : 'TBA'}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-4 gap-2">
                    <span role="img" aria-label="organization">
                      🏢
                    </span>
                    {listing.organization?.name || 'Unknown Organization'}
                  </div>
                </div>
                <div className="mt-auto">
                  <Link
                    href={`/listing/${listing.id}`}
                    className="inline-block bg-gradient-to-r from-[#4CAF50] to-[#81C784] text-white font-semibold px-5 py-2 rounded-full shadow hover:from-[#388e3c] hover:to-[#66bb6a] transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 mt-12">
            <div className="text-5xl mb-3">😔</div>
            <p className="text-xl font-medium">
              No opportunities available at the moment.
              <br />
              Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
