'use server';

import prisma, { GetUser } from '@/lib/prisma';
import { forbidden, notFound, redirect } from 'next/navigation';

/**
 *
 * @param {number} listingId - The ID of the listing to apply for
 * @param {(string | null)} description - The description of the application
 * @returns {Promise<redirect>} Redirect to the listing page if successful, otherwise an error message
 * This function creates a new application for a listing by the current user.
 */
export default async function CreateApplication(listingId: number, description: string | null) {
  const user = await GetUser();

  if (!user) {
    return forbidden();
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing) {
    return notFound();
  }

  // check there is not already an application for this listing by this user
  if (
    (await prisma.application.count({
      where: { listingId, userId: user.id },
    })) > 0
  ) {
    return forbidden();
  }

  await prisma.application.create({
    data: { listingId, userId: user.id, description },
  });

  return redirect(`/listing/${listingId}`);
}
