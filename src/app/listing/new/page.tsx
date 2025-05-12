import { GetUser, SignupComplete } from '@/lib/prisma';
import CreateListingForm from './form';
import { forbidden, redirect } from 'next/navigation';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Create Listing - Match4Good`,
};

export default async function App() {
  const user = await GetUser(true);

  if (!user) {
    return forbidden();
  }
  if (user) {
    const signupCompleted = await SignupComplete();
    if (!signupCompleted) {
      redirect('/user/sign-up');
    }
    const organizations = user?.ownerOf.map((organization) => organization.id) || [];

    const num_of_orgs = organizations.length;

    if (num_of_orgs === 0) {
      return forbidden();
    }
  }

  return (
    <div className="self-center flex justify-center p-12 md:p-24 w-screen max-w-4xl">
      <CreateListingForm user={user} />
    </div>
  );
}
