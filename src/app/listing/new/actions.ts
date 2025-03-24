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
<<<<<<< HEAD
<<<<<<< HEAD
 * Retrieves an array of organizations the user is associated with.
 * @returns Array of organizations or null if no user is logged in.
 */
async function getUserOrganizations(): Promise<Organization[] | null> {
=======
=======
>>>>>>> fe27b7e (Applies prettier fixes)
 * This method returns an array containing the organizations a user is linked
 * with or null
 * @returns Array of organizations linked with user or null if no user logged in
 */
async function getUserOrganizations(): Promise<Organization[] | null> {
  // Makes sense to do appropriate checks before checking for organizaions
  // linked with user
<<<<<<< HEAD
>>>>>>> e4ee13e (Applies prettier fixes)
=======
>>>>>>> fe27b7e (Applies prettier fixes)
  const user = await getUser(true);
  if (!user) {
    return null;
  }

<<<<<<< HEAD
<<<<<<< HEAD
=======
  // We use a set for de-duplication as it naturally has unique elements
>>>>>>> e4ee13e (Applies prettier fixes)
=======
  // We use a set for de-duplication as it naturally has unique elements
>>>>>>> fe27b7e (Applies prettier fixes)
  const user_orgs = [...new Set([...user.owner_of, ...user.member_of])];

  return user_orgs;
}

/**
<<<<<<< HEAD
<<<<<<< HEAD
 * Handles form submission for creating a volunteer opportunity.
 * - Validates required fields.
 * - Ensures the selected organization is valid.
 * - Saves the listing to the database if all conditions are met.
 * 
 * @param form_data Data inputted by the user.
 * @returns Redirection to the new listing or an error message.
=======
=======
>>>>>>> fe27b7e (Applies prettier fixes)
 * Creates form and handles form submission for creating volunteer oppportunity
 * by validating the input fields
 *
 * Completes/Ensures these **server-side** actions:
 * - Ensures the name field is not empty.
 * - Checks that both start and end dates and times are provided.
 * - Validates that the end date and time is the same as or
 * after the start date and time.
 * - Displays an appropriate error message if validation fails.
 * - Logs the form data to the console if all validations pass
 * and passes to the server to create new record in database
 * - Listing is linked to one of the user's organisation
 * @param form_data Form data inputted/submitted by user.
 * @returns redirection to new created listing (if valid data inputted),
 * else returns an error message.
<<<<<<< HEAD
>>>>>>> e4ee13e (Applies prettier fixes)
=======
>>>>>>> fe27b7e (Applies prettier fixes)
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
<<<<<<< HEAD
<<<<<<< HEAD
    return "End date must be the same as or after the start date";
=======
    return "End date must be same as or after the start date";
>>>>>>> e4ee13e (Applies prettier fixes)
=======
    return "End date must be same as or after the start date";
>>>>>>> fe27b7e (Applies prettier fixes)
  }

  const user_orgs = await getUserOrganizations();
  if (!user_orgs || user_orgs.length === 0) {
<<<<<<< HEAD
<<<<<<< HEAD
    return "No organizations associated with the account";
=======
    return "No organizations associated with account";
>>>>>>> e4ee13e (Applies prettier fixes)
=======
    return "No organizations associated with account";
>>>>>>> fe27b7e (Applies prettier fixes)
  }

  if (!user_orgs.some((org) => org.id === form_data.organization_id)) {
    return "Invalid organization selected.";
  }

<<<<<<< HEAD
<<<<<<< HEAD
  // Save the listing
=======
  // We have to manually destructure data as we have converted the datetime
  // from a string to a date object since Prisma expects Date objects
>>>>>>> e4ee13e (Applies prettier fixes)
=======
  // We have to manually destructure data as we have converted the datetime
  // from a string to a date object since Prisma expects Date objects
>>>>>>> fe27b7e (Applies prettier fixes)
  const listing = await prisma.listing.create({
    data: {
      name: form_data.name,
      description: form_data.description,
      start_datetime: start_datetime,
<<<<<<< HEAD
<<<<<<< HEAD
      end_datetime: end_datetime,
=======
      end_datetime: start_datetime,
>>>>>>> e4ee13e (Applies prettier fixes)
=======
      end_datetime: start_datetime,
>>>>>>> fe27b7e (Applies prettier fixes)
      organization_id: form_data.organization_id,
    },
  });

  return redirect(`/listing/${listing.id}`);
}
