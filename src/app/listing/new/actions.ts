"use server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import authenticateUserForLisitingCreation, {
  findUserOrganizations,
} from "./auth";

export interface CreateListingData {
  name: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  organizationId: number;
}

export async function createListing(formData: CreateListingData) {
  const isAuthenticated = await authenticateUserForLisitingCreation();
  if (!isAuthenticated) {
    return "Invalid Account type";
  }

  const userOrgs = await findUserOrganizations();
  if (!userOrgs || userOrgs.length === 0) {
    return "No organizations associated with account";
  }

  if (!userOrgs.some((org) => org.id === formData.organizationId)) {
    return "Invalid organization selected.";
  }

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

  const orgExists = await prisma.organization.findUnique({
    where: { id: formData.organizationId },
  });

  if (!orgExists) {
    return "Organization does not exist.";
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

  return "Valid Data";
  // We will uncomment this once we have impelemented this route
  //return redirect(`/listing/${listing.id}`);
}
