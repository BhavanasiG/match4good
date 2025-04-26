// import SignUpForm from "./form"; TODO
import prisma, { GetUser } from '@/lib/prisma';
import { forbidden } from 'next/navigation';

export default async function SignUpForm() {
  const user = await GetUser(true);
  const minimum_interests = 3;

  if (!user) {
    return forbidden();
  } else {
    const user_obj = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        interests: true,
      },
    });
    const interests = user_obj?.interests.map((interest) => interest.id) || [];

    const num_of_interests = interests.length;

    if (num_of_interests >= minimum_interests) {
      return <div>You have already signed up.</div>;
    } else {
      return (
        <div>
          <b>Sign Up Page</b>
          {/* TODO */}
          {/* <SignUpForm user={user} /> */}
        </div>
      );
    }
  }
}
