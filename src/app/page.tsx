import CreateListingButton from '@/components/createListing';
import CreateOrgButton from '@/components/creatOrg';
import DynamicLoginLogoutButton from '@/components/login';
import ViewListingButton from '@/components/viewListing';
import { GetUser } from '@/lib/prisma';
import { redirect } from 'next/navigation'; // Import redirect
import { headers } from 'next/headers'; // Import headers to get current path

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
    <div>
      <p>Hello, World!</p>
      <DynamicLoginLogoutButton />
      <br />
      <CreateListingButton />
      <br />
      <ViewListingButton />
      <br />
      <CreateOrgButton />
    </div>
  );
}
