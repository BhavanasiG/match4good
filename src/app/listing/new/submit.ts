'use server';

import prisma, { GetUser } from '@/lib/prisma';
import { forbidden, redirect } from 'next/navigation';
import { Organization } from '@/../generated/prisma_client';

/**
 * Interface for the data structure expected by the CreateListing Server Action.
 * @property {string} name - The listing's title.
 * @property {string} description - The listing's description.
 * @property {object} dateRange - The date and time range for the listing.
 * @property {string} dateRange.startDatetime - The start datetime string.
 * @property {string} dateRange.endDatetime - The end datetime string.
 * @property {number} organizationId - The ID of the hosting organization.
 * @property {number[]} categories - An array of selected subcategory IDs.
 */
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
 * Suitable for populating forms like the sign-up or listing creation.
 * @returns {Promise<Array<{ id: number; name: string; description: string | null; subcategories: Array<{ id: number; name: string; description: string | null; }> }>>} An array of categories with their nested subcategories.
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
 * Fetches the organizations that the currently authenticated user owns or is a member of.
 * Requires user authentication via GetUser.
 * @returns {Promise<Organization[] | null>} A promise resolving to an array of organizations, or null if no user is logged in.
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
 * Server Action to create a new volunteer listing based on form data.
 * Performs validation checks and creates the listing linked to a user's organization and selected categories.
 * Calculates point value based on duration.
 * @param {CreateListingData} formData - The validated data submitted from the new listing form.
 * @returns {Promise<string | void>} Returns a string error message on validation failure, or triggers a redirect on success or forbidden.
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
