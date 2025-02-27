"use server";
import { getAccountType } from "@/lib/auth0";
import prisma from "@/lib/prisma";
import { auth0 } from "@/lib/auth0";
/**
 * Authenticates if a user can create a listing
 *
 * > Organizational users **can** create listings
 *
 * > Non Organisational users **cannot** curently create listings
 * @returns true if user account type is organization else returns flase
 */
export default async function authenticateUserForListingCreation() {
  const accountType = await getAccountType();

  return accountType === "organization";
}

/**
 * Retrieves organizations that the user is associated with.
 * Uses `authenticateUserForListingCreation()` as sub-function
 * @returns Array of organisations or null if none
 */
export async function findUserOrganizations() {
  // Makes sense to do appropriate checks before checking for organizaions
  // linked with user
  const session = await auth0.getSession();
  if (!session) {
    return null;
  }

  const organizationAccount = await authenticateUserForListingCreation();

  if (!organizationAccount) {
    return null;
  }

  const auth0UserId = session.user.sub;

  const user = await prisma.user.findUnique({
    where: { user_id: auth0UserId },
    include: {
      owner_of: { select: { id: true, name: true } },
      member_of: { select: { id: true, name: true } },
    },
  });

  if (!user) {
    return null;
  }

  // We use a hashmap for de-duplication as it naturally has unique keys
  const userOrgs = [
    ...new Map(
      [...user.owner_of, ...user.member_of].map((org) => [org.id, org])
    ).values(),
  ];

  return userOrgs;
}
