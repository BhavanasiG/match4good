'use server';

import prisma, { GetUser } from '@/lib/prisma';
import { ApplicationStatus, ListingStatus } from '@/../generated/prisma_client';

/**
 * Sets the status of a specific application.
 * Checks if the authenticated user is authorized (organization owner/member).
 * @param {number} applicationId - The ID of the application to update.
 * @param {ApplicationStatus} status - The new status to set for the application.
 * @returns {Promise<boolean>} True if the status was updated successfully, false otherwise (e.g., unauthorized, not found).
 */
export async function SetApplicationStatus(
  applicationId: number,
  status: ApplicationStatus,
): Promise<boolean> {
  const user = await GetUser(true);

  if (!user) {
    return false;
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    return false;
  }

  const listing = await prisma.listing.findUnique({
    where: { id: application.listingId },
  });

  if (!listing) {
    return false;
  }

  if (
    !user.memberOf.some((org) => org.id === listing.organizationId) &&
    !user.ownerOf.some((org) => org.id === listing.organizationId)
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
 * Sets the status of a specific listing.
 * Checks if the authenticated user is authorized (organization owner/member).
 * @param {number} listingId - The ID of the listing to update.
 * @param {ListingStatus} status - The new status to set for the listing.
 * @returns {Promise<boolean>} True if the status was updated successfully, false otherwise (e.g., unauthorized, not found).
 */
export async function SetListingStatus(listingId: number, status: ListingStatus): Promise<boolean> {
  const user = await GetUser(true);

  if (!user) {
    return false;
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing) {
    return false;
  }

  if (
    !user.memberOf.some((org) => org.id === listing.organizationId) &&
    !user.ownerOf.some((org) => org.id === listing.organizationId)
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
 * Distributes points for a completed listing to accepted applicants and their regions.
 * Ensures points are only distributed once per listing using the 'scored' flag.
 * @param {number} listingId - The ID of the listing to distribute points for.
 * @returns {Promise<boolean>} True if points were distributed, false otherwise (e.g., unauthorized, not found, already scored).
 */
export async function DistributePointsFor(listingId: number): Promise<boolean> {
  // todo, have all the initial checks be refactored into a separate thing.
  // is middleware an option here?
  const user = await GetUser(true);

  if (!user) return false;

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { applications: true },
  });

  if (!listing) return false;

  if (
    !user.memberOf.some((org) => org.id === listing.organizationId) &&
    !user.ownerOf.some((org) => org.id === listing.organizationId)
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
      where: { id: application.userId },
    });
    if (!user || !user.regionId) continue;

    await prisma.region.update({
      where: { id: user.regionId },
      data: { points: { increment: listing.pointValue } },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { totalPoints: { increment: listing.pointValue } },
    });
  }

  return true;
}
