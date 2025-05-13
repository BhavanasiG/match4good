'use server';

import prisma, { GetUser } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Organization } from '@/../generated/prisma_client';

/**
 * Interface for the data expected when creating a new listing.
 * @property {string} name - The name of the listing.
 * @property {string} description - The description of the listing.
 * @property {string} startDatetime - The start date and time string.
 * @property {string} endDatetime - The end date and time string.
 * @property {number} organizationId - The ID of the organization hosting the listing.
 */
export interface CreateListingData {
  name: string;
  description: string;
  startDatetime: string;
  endDatetime: string;
  organizationId: number;
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
 * Server Action to create a new volunteer listing.
 * Performs basic validation and creates the listing linked to a user's organization.
 * @param {CreateListingData} formData - The data submitted from the new listing form.
 * @returns {Promise<string | void>} Returns a string error message on validation failure, or triggers a redirect on success.
 */
export async function CreateListing(formData: CreateListingData) {
  if (!formData.name.trim()) {
    return 'Name is required';
  }

  const startDatetime = new Date(formData.startDatetime);
  const endDatetime = new Date(formData.endDatetime);
  const now = new Date();

  if (!formData.startDatetime || !formData.endDatetime) {
    return 'Both start and end dates are required';
  }

  if (startDatetime < now) {
    return 'Start date cannot be in the past';
  }

  if (startDatetime > endDatetime) {
    return 'End date must be the same as or after the start date';
  }

  const userOrgs = await getUserOrganizations();
  if (!userOrgs || userOrgs.length === 0) {
    return 'No organizations associated with the account';
  }

  if (!userOrgs.some((org) => org.id === formData.organizationId)) {
    return 'Invalid organization selected.';
  }

  // Save the listing
  const listing = await prisma.listing.create({
    data: {
      name: formData.name,
      description: formData.description,
      startDatetime: startDatetime,
      endDatetime: endDatetime,
      organizationId: formData.organizationId,
    },
  });

  return redirect(`/listing/${listing.id}`);
}
