﻿﻿﻿import DynamicLoginLogoutButton from '@/components/login';
import { GetUser } from '@/lib/prisma';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function App() {
  const user = await GetUser();

  // If the user is logged in (user is not null), check their signup status
  if (user) {
    // If signup is not completed, and they are not already on the signup page, redirect them.
    // We check the current path to avoid an infinite redirect loop
    // Await the headersListPromise to get the ReadonlyHeaders object
    const headersList = await headers();
    const currentPath = headersList.get('x-invoke-path') || headersList.get('x-pathname'); // Get the current path

    if (!user.signupCompleted && currentPath !== '/user/sign-up') {
      redirect('/user/sign-up');
    }

    // If signup is completed or user is already on signup page,
    // continue rendering the home page content below.
  }

  // If the user is not logged in, or if they are logged in and signup is complete,
  // render the content of the home page.
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] to-[#f1f8e9] flex flex-col">
      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex justify-end">
        {/* Remove className for now if your component doesn't support it */}
        <DynamicLoginLogoutButton />
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#388e3c] text-center mb-4 tracking-tight">
          <span className="block">Connect for Good with</span>
          <span className="block bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Match4Good
          </span>
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl text-center mb-8">
          Your gateway to meaningful volunteering opportunities and community impact.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-wrap justify-center gap-5 mb-10">
          <Link href="/listing/new" passHref>
            <button
              className="
              flex items-center gap-2
              px-5 py-2
              bg-gradient-to-r from-green-300 to-green-500
              text-green-900 uppercase font-semibold rounded-full
              shadow-md
              hover:scale-105 hover:shadow-lg hover:bg-green-400
              focus:outline-none focus:ring-2 focus:ring-green-200
              transition-all duration-200
              text-base
            "
            >
              <span className="text-2xl">✨</span>
              Create Volunteering Opportunity
            </button>
          </Link>
          <Link href="/listing" passHref>
            <button
              className="
              flex items-center gap-2
              px-5 py-2
              bg-gradient-to-r from-green-300 to-green-500
              text-green-900 uppercase font-semibold rounded-full
              shadow-md
              hover:scale-105 hover:shadow-lg hover:bg-green-400
              focus:outline-none focus:ring-2 focus:ring-green-200
              transition-all duration-200
              text-base
            "
            >
              <span className="text-2xl">🔍</span>
              View Volunteering Opportunities
            </button>
          </Link>
          <Link href="/org/new" passHref>
            <button
              className="
              flex items-center gap-2
              px-5 py-2
              bg-gradient-to-r from-green-300 to-green-500
              text-green-900 uppercase font-semibold rounded-full
              shadow-md
              hover:scale-105 hover:shadow-lg hover:bg-green-400
              focus:outline-none focus:ring-2 focus:ring-green-200
              transition-all duration-200
              text-base
            "
            >
              <span className="text-2xl">🏢</span>
              Create Organization
            </button>
          </Link>
        </div>

        {/* How It Works Section */}
        <section className="max-w-4xl w-full mx-auto mt-10">
          <h2 className="text-xl font-bold text-[#388e3c] text-center mb-8">
            How Match4Good Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow duration-300 group">
              <div className="text-green-600 text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🔎
              </div>
              <h3 className="text-base font-semibold mb-2">Discover Opportunities</h3>
              <p className="text-gray-600 text-sm">
                Browse or search for volunteering roles and community initiatives that match your
                interests.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow duration-300 group">
              <div className="text-green-600 text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🤝
              </div>
              <h3 className="text-base font-semibold mb-2">Get Involved</h3>
              <p className="text-gray-600 text-sm">
                Apply to volunteer, join organizations, or create your own opportunities to help
                others.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow duration-300 group">
              <div className="text-green-600 text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🎉
              </div>
              <h3 className="text-base font-semibold mb-2">Make an Impact</h3>
              <p className="text-gray-600 text-sm">
                Track your contributions and see the difference you make in your community.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8 mt-20">
        <div className="container mx-auto text-center">
          <p className="mb-4">
            Ready to make a difference? Start your journey with Match4Good today!
          </p>
          <p className="mt-4 text-sm opacity-75">
            © 2024 Match4Good. Empowering communities through volunteerism.
          </p>
        </div>
      </footer>
    </div>
  );
}
