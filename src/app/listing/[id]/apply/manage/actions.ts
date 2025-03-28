"use server";

import prisma, { getUser } from "@/lib/prisma";
import { ApplicationStatus, ListingStatus } from "@/../generated/prisma_client";

/**
 * Tries to set the application status, checking permissions
 * @param {number} application_id The application to set status
 * @param {ApplicationStatus} status The status to set
 * @returns {Promise<boolean>} `true` if the status was successfully set, otherwise false
 */
export async function setApplicationStatus(
  application_id: number,
  status: ApplicationStatus,
): Promise<boolean> {
  const user = await getUser(true);

  if (!user) {
    return false;
  }

  const application = await prisma.application.findUnique({
    where: { id: application_id },
  });

  if (!application) {
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

/**
 * Tries to set the listing status, checking permissions
 *
 * @param listing_id The listing to set status
 * @param status The status to set
 * @returns `true` if the status was successfully set, otherwise false
 */
export async function setListingStatus(
  listing_id: number,
  status: ListingStatus,
): Promise<boolean> {
  const user = await getUser(true);

  if (!user) {
    return false;
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listing_id },
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

  await prisma.listing.update({
    where: { id: listing.id },
    data: { status },
  });

  return true;
}

/**
 * Tries to distribute points for a listing
 *
 * @param listing_id The listing update points for
 = * @returns `true` if the points were correctly applied
 */
export async function distributePointsFor(
  listing_id: number,
): Promise<boolean> {
  // todo, have all the initial checks be refactored into a separate thing.
  // is middleware an option here?
  const user = await getUser(true);

  if (!user) return false;

  const listing = await prisma.listing.findUnique({
    where: { id: listing_id },
    include: { applications: true },
  });

  if (!listing) return false;

  if (
    !user.member_of.some((org) => org.id === listing.organization_id) &&
    !user.owner_of.some((org) => org.id === listing.organization_id)
  ) {
    return false;
  }

  // need to ensure that the function only continues if we actually set the flag here
  // need some kind of atomic compare and swap here maybe?
  const check = await prisma.listing.update({
    where: { id: listing.id, scored: false },
    data: { scored: true },
  });
  if (!check) return false;

  for (const application of listing.applications) {
    const user = await prisma.user.findUnique({
      where: { id: application.user_id },
    });
    if (!user || !user.region_id) continue;

    await prisma.region.update({
      where: { id: user.region_id },
      data: { points: { increment: listing.point_value } },
    });
  }

  return true;
}
