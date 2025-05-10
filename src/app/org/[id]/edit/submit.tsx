'use server';
import prisma, { GetUser, Organization } from '@/lib/prisma';
//import { forbidden } from 'next/navigation';

/**
 * Update the organization with the given values
 * @param {number} organizationId the id of the organization
 * @param {string} name the name of the organization
 * @param {string | null} description the description of the organization
 * @param {string} address the address of the organization
 * @param {string} postcode the postcode of the organization
 * @returns {Promise<Organization>} The updated organization.
 */
export async function UpdateOrganization(
  organizationId: number,
  name: string,
  description: string | null,
  address: string,
  postcode: string,
) {
  const user = await GetUser(true);
  if (!user) {
    return { success: false, message: 'Authentication required.' };
  }

  // Check ownership based on the organization ID passed in
  const organizationToUpdate = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: { owner: true },
  });

  if (!organizationToUpdate) {
    return { success: false, message: 'Organization not found.' };
  }

  if (organizationToUpdate.owner.id !== user.id) {
    return { success: false, message: 'Permission denied. Only the owner can edit.' };
  }

  try {
    const updatedOrganization: Organization = await prisma.organization.update({
      where: { id: organizationId },
      data: {
        name: name,
        description: description,
        address: address,
        postcode: postcode,
      },
      include: {
        owner: true,
        members: true,
        followers: true,
      },
    });

    console.log(`Organization ${organizationId} updated by user ${user.id}.`);
    return {
      success: true,
      organization: updatedOrganization,
      message: 'Changes saved successfully.',
    };
  } catch (error) {
    console.error('Error updating organization:', error);
    return { success: false, message: 'Failed to update organization due to a server error.' };
  }
}
