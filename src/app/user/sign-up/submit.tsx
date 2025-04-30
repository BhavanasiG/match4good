'use server';

import prisma, { GetUser } from '@/lib/prisma';
import { forbidden } from 'next/navigation';

/**
 * Fetches all categories and their subcategories from the database.
 * Returns a structured format suitable for the sign-up form.
 * @returns {Promise<Array<{
 *   id: number;
 *   name: string;
 *   description: string | null;
 *   subcategories: Array<{
 *     id: number;
 *     name: string;
 *     description: string | null;
 *   }>;
 * }>>} An array of categories with their nested subcategories
 * @throws {Error} If database query fails
 */
export async function GetCategories() {
  const categories = await prisma.category.findMany({
    include: {
      subcategories: true,
    },
  });

  const categoryList = categories.map((category) => {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      subcategories: category.subcategories.map((subcategory) => ({
        id: subcategory.id,
        name: subcategory.name,
        description: subcategory.description,
      })),
    };
  });
  return categoryList;
}

/**
 * Creates or updates user interests in the database.
 * Connects the selected subcategory IDs to the current user's profile.
 * @param {object} formData - The form data containing selected interests
 * @param {number[]} formData.interests - Array of subcategory IDs to connect to user
 * @returns {Promise<number>} Status code (1 for success, 0 for failure)
 * @throws {Error} If user is not authenticated or database operation fails
 */
export async function CreateInterests(formData: { interests: number[] }) {
  const user = await GetUser();

  if (!user) {
    return forbidden();
  }

  const { interests } = formData;

  const userObj = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      interests: true,
    },
  });

  if (!userObj) {
    return 0;
  }

  const existingInterests = userObj.interests.map((interest) => interest.id);
  const newInterests = interests.filter((interest) => !existingInterests.includes(interest));

  await prisma.user.update({
    where: { id: user.id },
    data: {
      interests: {
        connect: newInterests.map((interest) => ({ id: interest })),
      },
    },
  });

  return 1;
}
