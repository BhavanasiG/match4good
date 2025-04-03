"use server";

import prisma, { getUser } from "@/lib/prisma";
import { Application, ApplicationStatus } from "@/../generated/prisma_client";

/**
 * Tries to set the application status, checking permissions
 *
 * @param application The application to set status
 * @param status The status to set
 * @returns `true` if the status was successfully set, otherwise false
 */
export async function setApplicationStatus(
  application: Application,
  status: ApplicationStatus
): Promise<boolean> {
  const user = await getUser(true);

  if (!user) {
    return false;
  }

  const listing = await prisma.listing.findUnique({
    where: { id: application.listing_id },
  });

  if (!listing) {
    return false;
  }

  if (
    !user.member_of.some((org) => org.id === listing.organization_id) &&
    !user.owner_of.some((org) => org.id === listing.organization_id)
  ) {
    return false;
  }

  await prisma.application.update({
    where: { id: application.id },
    data: { status },
  });

  return true;
}
