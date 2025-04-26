'use server';

import prisma, { GetUser } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Category } from '@/../generated/prisma_client';

export interface CreateInterestsData {
  userId: number;
  interests: number[]; // Array of interest IDs
}

/**
 * This function fetches all categories and their subcategories from the database
 * and returns them in a structured format.
 * @returns {Promise<Category[]>} An array of categories with their subcategories.
 */
export async function GetCategories(): Promise<Category[]> {
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
 * In-progress function to handles form submission for creating interests
 * by validating the input fields
 * @param {CreateInterestsData} formData Form data inputted/submitted by user.
 * @returns {redirect} - Redirects to the home page if successful, otherwise returns an error message.
 */
export async function CreateInterests(formData: CreateInterestsData) {
  const user = await GetUser(true);
  if (!user) {
    return 'User not logged in';
  }

  const { interests } = formData;
  if (interests.length < 3) {
    return 'Please select at least 3 interests.';
  }

  const userObj = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      interests: true,
    },
  });

  if (!userObj) {
    return 'User not found';
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

  redirect('/');
}
