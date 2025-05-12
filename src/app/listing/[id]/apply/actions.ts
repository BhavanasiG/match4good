'use server';

import prisma, { GetUser } from '@/lib/prisma';
import { forbidden, notFound, redirect } from 'next/navigation';

/**
 * Creates a new application for a listing by the currently authenticated user.
 * Checks user authentication, listing existence, and prevents duplicate applications.
 * Triggers navigation or an error response based on the outcome.
 * @param {number} listingId - The ID of the listing the user is applying for.
 * @param {string | null} description - The user's description for the application.
 * @returns {Promise<void>} This Server Action triggers a redirect on success or calls `forbidden()`/`notFound()` on failure. It does not return a value directly to the client.
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
