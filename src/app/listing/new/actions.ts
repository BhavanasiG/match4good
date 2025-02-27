"use server";

import prisma, { getUser } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Organization } from "@/../generated/prisma_client";

export interface CreateListingData {
  name: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  organizationId: number;
}

async function getUserOrganizations(): Promise<Organization[] | null> {
  // Makes sense to do appropriate checks before checking for organizaions
  // linked with user
  const user = await getUser(true);
  if (!user) {
    return null;
  }

  // We use a set for de-duplication as it naturally has unique elements
  const userOrgs = [...new Set([...user.owner_of, ...user.member_of])];

  return userOrgs;
}

export async function createListing(formData: CreateListingData) {
  if (!formData.name.trim()) {
    return "Name is required";
  }

  const startDateTime = new Date(formData.startDateTime);
  const endDateTime = new Date(formData.endDateTime);
  const now = new Date();

  if (!formData.startDateTime || !formData.endDateTime) {
    return "Both start and end dates are required";
  }

  if (startDateTime < now) {
    return "Start date cannot be in the past";
  }

  if (startDateTime > endDateTime) {
    return "End date must be same as or after the start date";
  }

  const userOrgs = await getUserOrganizations();
  if (!userOrgs || userOrgs.length === 0) {
    return "No organizations associated with account";
  }

  if (!userOrgs.some((org) => org.id === formData.organizationId)) {
    return "Invalid organization selected.";
  }

  // We have to manually destructure data as we have converted the datetime
  // from a string to a date object since Prisma expects Date objects
  const listing = await prisma.listing.create({
    data: {
      name: formData.name,
      description: formData.description,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      organizationId: formData.organizationId,
    },
  });

  return redirect(`/listing/${listing.id}`);
}
