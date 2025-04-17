import { GetUser } from '@/lib/prisma';
import CreateOrganizationForm from './form';
import { forbidden } from 'next/navigation';

export default async function App() {
  const user = await GetUser(true);

  if (!user) {
    return forbidden();
  }

  return (
    <div className="self-center flex justify-center p-12 md:p-24 w-screen max-w-4xl">
      <CreateOrganizationForm />
    </div>
  );
}
