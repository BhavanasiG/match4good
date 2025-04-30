// import SignUpForm from "./form"; TODO
import prisma, { GetUser } from '@/lib/prisma';
import { forbidden } from 'next/navigation';
import SignUpForm from './form';

export default async function App() {
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
      return forbidden();
    } else {
      const categories = await prisma.category.findMany();
      const subcategories = await prisma.subcategory.findMany({
        select: {
          name: true,
          description: true,
          primaryCategoryId: true,
        },
      });

      return (
        <div className="self-center flex justify-center p-12 md:p-24 w-screen max-w-4xl">
          <SignUpForm />
        </div>
      );
    }
  }
}
