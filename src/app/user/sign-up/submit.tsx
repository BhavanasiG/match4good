'use server';

import prisma, { GetUser } from '@/lib/prisma';
import { Prisma } from '../../../../generated/prisma_client/index.js';
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
  try {
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
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to load categories.');
  }
}

/**
 * Server Action to fetch all available regions from the database.
 * @returns {Promise<{ id: number; name: string }[] | { success: false; message: string }>} - List of regions or error result.
 */
export async function GetRegions() {
  try {
    const regions = await prisma.region.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return regions;
  } catch (error) {
    console.error('Error fetching regions:', error);

    return { success: false, message: 'Failed to fetch regions due to a server error.' };
  }
}

/**
 * Server Action to complete the user signup process.
 * Saves user interests, selected region, and sets signupCompleted to true.
 * This replaces the previous CreateInterests function.
 * @param {object} params - The parameters object.
 * @param {number[]} params.interests - An array of subcategory IDs representing the user's interests.
 * @param {number} params.regionId - The ID of the user's selected region.
 * @returns {Promise<{ success: boolean; message: string }>} - Result of the operation.
 */
export async function CompleteSignup({
  interests,
  regionId,
}: {
  interests: number[];
  regionId: number;
}) {
  const user = await GetUser();

  if (!user) {
    console.warn('CompleteSignup called without an authenticated user.');
    return { success: false, message: 'Authentication required.' };
  }

  const userExists = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true },
  });

  if (!userExists) {
    console.error(`Database record not found for authenticated user ID: ${user.id}`);
    return { success: false, message: 'User profile not found in database.' };
  }

  try {
    const regionExists = await prisma.region.findUnique({
      where: { id: regionId },
      select: { id: true },
    });
    if (!regionExists) {
      console.warn(`User ${user.id} attempted to set invalid regionId: ${regionId}`);
      return { success: false, message: 'Invalid region selected.' };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        regionId: regionId,
        signupCompleted: true,
        interests: {
          set: interests.map((id) => ({ id })),
        },
      },
    });

    console.log(
      `User ${user.id} completed signup with region ${regionId} and ${interests.length} interests.`,
    );

    return { success: true, message: 'Signup completed successfully!' };
  } catch (error: unknown) {
    console.error(`Error completing signup for user ${user.id}:`, error);

    // Handle potential errors (e.g., invalid interest IDs, database errors)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2025 means a record needed for an operation was not found
      if (error.code === 'P2025') {
        console.error(
          'Prisma error P2025 (record not found) during signup completion:',
          error.meta,
        );
        // This likely means one or more interest IDs submitted were invalid
        return { success: false, message: 'One or more selected interests were invalid.' };
      }
      console.error(`Prisma error code ${error.code} during signup completion:`, error);
    }
    throw new Error('Failed to complete signup due to a server error.');
  }
}
