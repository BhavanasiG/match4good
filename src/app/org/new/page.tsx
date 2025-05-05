import { GetUser, SignupComplete } from '@/lib/prisma';
import CreateOrganizationForm from './form';
import { forbidden, redirect } from 'next/navigation';

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
  }

  return (
    <div className="self-center flex justify-center p-12 md:p-24 w-screen max-w-4xl">
      <CreateOrganizationForm />
    </div>
  );
}
