'use server';

import prisma, { GetUser } from '@/lib/prisma';
import { forbidden, redirect } from 'next/navigation';
import { Organization } from '@/../generated/prisma_client';

export interface CreateListingData {
  name: string;
  description: string;
  dateRange: {
    startDatetime: string;
    endDatetime: string;
  };
  organizationId: number;
  categories: number[];
}

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
 * This method returns an array containing the organizations a user is linked
 * with or null
 * @returns {Promise<Organization[] | null>} Array of organizations linked with user or null if no user logged in
 */
async function getUserOrganizations(): Promise<Organization[] | null> {
  const user = await GetUser(true);
  if (!user) {
    return null;
  }

  const userOrgs = [...new Set([...user.ownerOf, ...user.memberOf])];

  return userOrgs;
}

/**
 * Creates form and handles form submission for creating volunteer oppportunity
 * by validating the input fields
 *
 * Completes/Ensures these **server-side** actions:
 * - Ensures the name field is not empty.
 * - Checks that both start and end dates and times are provided.
 * - Validates that the end date and time is the same as or
 * - Displays an appropriate error message if validation fails.
 * - Listing is linked to one of the user's organisation
 * @param {CreateListingData} formData Form data inputted/submitted by user.
 * @returns {redirect} redirection to new created listing (if valid data inputted),
 */
export async function CreateListing(formData: CreateListingData) {
  const user = await GetUser(true);
  if (!user) {
    return forbidden();
  }

  if (!formData.name.trim()) {
    return 'Name is required';
  }

  const startDatetime = new Date(formData.dateRange.startDatetime);
  const endDatetime = new Date(formData.dateRange.endDatetime);
  const now = new Date();

  if (!startDatetime || !endDatetime) {
    return 'Both start and end dates are required';
  }

  if (startDatetime < now) {
    return 'Start date cannot be in the past';
  }

  if (startDatetime > endDatetime) {
    return 'End date must be same as or after the start date';
  }

  const hours = (endDatetime.getTime() - startDatetime.getTime()) / (1000 * 60 * 60);

  const userOrgs = await getUserOrganizations();
  if (!userOrgs || userOrgs.length === 0) {
    return 'No organizations associated with account';
  }

  if (!userOrgs.some((org) => org.id === formData.organizationId)) {
    return 'Invalid organization selected.';
  }

  const categories = formData.categories;
  if (!categories || categories.length === 0) {
    return 'At least one category is required';
  }

  // Save the listing
  // We have to manually destructure data as we have converted the datetime
  // from a string to a date object since Prisma expects Date objects

  const listing = await prisma.listing.create({
    data: {
      name: formData.name,
      description: formData.description,
      startDatetime: startDatetime,
      endDatetime: endDatetime,
      organizationId: formData.organizationId,
      // todo, have a config somewhere to not hard-code it here
      pointValue: hours * 1000,
      categories: {
        connect: categories.map((categoryId) => ({
          id: categoryId,
        })),
      },
    },
  });

  return redirect(`/listing/${listing.id}`);
}
