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
 * Retrieves an array of organizations the user is associated with.
 * @returns Array of organizations or null if no user is logged in.
 */
async function getUserOrganizations(): Promise<Organization[] | null> {
  const user = await getUser(true);
  if (!user) {
    return null;
  }

  const user_orgs = [...new Set([...user.owner_of, ...user.member_of])];

  return user_orgs;
}

/**
 * Handles form submission for creating a volunteer opportunity.
 * - Validates required fields.
 * - Ensures the selected organization is valid.
 * - Saves the listing to the database if all conditions are met.
 * 
 * @param form_data Data inputted by the user.
 * @returns Redirection to the new listing or an error message.
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
      end_datetime: end_datetime, // Fix: Use correct end_datetime
      organization_id: form_data.organization_id,
    },
  });

  return redirect(`/listing/${listing.id}`);
}
