"use server";

import prisma, { getUser } from "@/lib/prisma";
import { forbidden, notFound, redirect } from "next/navigation";

export default async function createApplication(
  listing_id: number,
  description: string | null
) {
  const user = await getUser();

  if (!user) {
    return forbidden();
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listing_id },
  });

  if (!listing) {
    return notFound();
  }

  // check there is not already an application for this listing by this user
  if (
    (await prisma.application.count({
      where: { listing_id, user_id: user.id },
    })) > 0
  ) {
    return forbidden();
  }

  await prisma.application.create({
    data: { listing_id, user_id: user.id, description },
  });

  return redirect(`/listing/${listing_id}`);
}
