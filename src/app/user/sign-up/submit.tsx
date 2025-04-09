"use server";

import prisma, { GetUser } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Category } from "@/../generated/prisma_client";

export interface CreateInterestsData {
  user_id: number;
  interests: number[]; // Array of interest IDs
}

/**
 * This function fetches all categories and their subcategories from the database
 * and returns them in a structured format.
 * @returns {Promise<Category[]>} An array of categories with their subcategories.
 */
export async function getCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    include: {
      subcategories: true,
    },
  });

  const category_list = categories.map((category) => {
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
  return category_list;
}

/**
 * In-progress function to handles form submission for creating interests
 * by validating the input fields
 * @param {CreateInterestsData} form_data Form data inputted/submitted by user.
 * @returns {redirect} - Redirects to the home page if successful, otherwise returns an error message.
 */
export async function createInterests(form_data: CreateInterestsData) {
  const user = await GetUser(true);
  if (!user) {
    return "User not logged in";
  }

  const { interests } = form_data;
  if (interests.length < 3) {
    return "Please select at least 3 interests.";
  }

  const user_obj = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      interests: true,
    },
  });

  if (!user_obj) {
    return "User not found";
  }

  const existing_interests = user_obj.interests.map((interest) => interest.id);

  const new_interests = interests.filter(
    (interest) => !existing_interests.includes(interest),
  );

  await prisma.user.update({
    where: { id: user.id },
    data: {
      interests: {
        connect: new_interests.map((interest) => ({ id: interest })),
      },
    },
  });

  redirect("/");
}
