"use server";

import prisma, { getUser } from "@/lib/prisma";
import { redirect } from "next/navigation";

export interface CreateInterestsData {
  user_id: number;
  interests: number[]; // Array of interest IDs
}

async function getCategories() {
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

export async function createInterests(form_data: CreateInterestsData) {
  const user = await getUser(true);
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
    (interest) => !existing_interests.includes(interest)
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
