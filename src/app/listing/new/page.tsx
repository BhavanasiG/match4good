import { GetUser } from '@/lib/prisma';
import CreateListingForm from './form';
import { forbidden } from 'next/navigation';

<<<<<<< HEAD
export default async function App() {
  const user = await GetUser(true);
=======
/**
 * This function shows a forbiden page if user is not logged in, otherwise,
 * it renders the CreateListingForm for the user to create a new listing.
 *
 * @returns forbidden (if user not logged in), else returns the
 * CreateListingForm page
 */
export default async function CreateOpportunityForm() {


  const user = await getUser(true);
>>>>>>> 8cd34d1 (Preliminary code for user interest selection page)

  if (!user) {
    return forbidden();
  }

  return (
    <div className="self-center flex justify-center p-12 md:p-24 w-screen max-w-4xl">
      <CreateListingForm user={user} />
    </div>
  );
}
