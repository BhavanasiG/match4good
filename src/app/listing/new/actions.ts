'use server';

import prisma, { GetUser } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Organization } from '@/../generated/prisma_client';

export interface CreateListingData {
  name: string;
  description: string;
  startDatetime: string;
  endDatetime: string;
  organizationId: number;
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
 * Handles form submission for creating volunteer oppportunity
 * by validating the input fields
 *
 * Completes/Ensures these **server-side** actions:
 * - Ensures the name field is not empty.
 * - Checks that both start and end dates and times are provided.
 * - Validates that the end date and time is the same as or
 * after the start date and time.
 * - Displays an appropriate error message if validation fails.
 * and passes to the server to create new record in database
 * - Listing is linked to one of the user's organisation
 * @param {CreateListingData} formData Form data inputted/submitted by user.
 * @returns {redirect} redirection to new created listing (if valid data inputted),
 * else returns an error message.
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
