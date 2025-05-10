'use server';
import prisma, { GetUser, Organization } from '@/lib/prisma';
import { forbidden } from 'next/navigation';

/**
 * Update the organization with the given values
 * @param {string} name the name of the organization
 * @param {string | null} description the description of the organization
 * @param {string} address the address of the organization
 * @param {string} postcode the postcode of the organization
 * @returns {Organization} the updated organization
 */
export async function UpdateOrganization(
  name: string,
  description: string | null,
  address: string,
  postcode: string,
) {
  const user = await GetUser(true);
  if (!user) {
    return forbidden();
  }

  const isOwner = await prisma.organization.findFirst({
    where: {
      name: name,
      ownerId: user.id,
    },
  });

  if (!isOwner) {
    return forbidden();
  }

  const organization: Organization = await prisma.organization.update({
    where: {
      name: name,
    },
    data: {
      name: name,
      description: description,
      address: address,
      postcode: postcode,
    },
    include: {
      owner: true, // Include owner for Edit button logic
      members: true, // Include members for Edit button logic
      followers: true, // Include followers for FollowButton logic
    },
  });

  return organization;
}
