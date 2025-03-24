"use server";

import prisma, { getUser } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Organization } from "@/../generated/prisma_client";

export interface CreateListingData {
  name: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  organization_id: number;
}

/**
 * This method returns an array containing the organizations a user is linked
 * with or null
<<<<<<< HEAD
 * @returns {Promise<Organization[] | null>} Array of organizations linked with user or null if no user logged in
=======
 * @returns Array of organizations linked with user or null if no user logged in
>>>>>>> fe27b7e (Applies prettier fixes)
 */
async function getUserOrganizations(): Promise<Organization[] | null> {
  // Makes sense to do appropriate checks before checking for organizaions
  // linked with user
  const user = await getUser(true);
  if (!user) {
    return null;
  }

  // We use a set for de-duplication as it naturally has unique elements
  const user_orgs = [...new Set([...user.owner_of, ...user.member_of])];

  return user_orgs;
}

/**
 * Creates form and handles form submission for creating volunteer oppportunity
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
 * @param {CreateListingData} form_data Form data inputted/submitted by user.
 * @returns {redirect} redirection to new created listing (if valid data inputted),
 * else returns an error message.
 */
export async function createListing(form_data: CreateListingData) {
  if (!form_data.name.trim()) {
    return "Name is required";
  }

  const start_datetime = new Date(form_data.start_datetime);
  const end_datetime = new Date(form_data.end_datetime);
  const now = new Date();

  if (!form_data.start_datetime || !form_data.end_datetime) {
    return "Both start and end dates are required";
  }

  if (start_datetime < now) {
    return "Start date cannot be in the past";
  }

  if (start_datetime > end_datetime) {
    return "End date must be the same as or after the start date";
  }

  const user_orgs = await getUserOrganizations();
  if (!user_orgs || user_orgs.length === 0) {
    return "No organizations associated with the account";
  }

  if (!user_orgs.some((org) => org.id === form_data.organization_id)) {
    return "Invalid organization selected.";
  }

  // Save the listing
  const listing = await prisma.listing.create({
    data: {
      name: form_data.name,
      description: form_data.description,
      start_datetime: start_datetime,
      end_datetime: end_datetime,
      organization_id: form_data.organization_id,
    },
  });

  return redirect(`/listing/${listing.id}`);
}
