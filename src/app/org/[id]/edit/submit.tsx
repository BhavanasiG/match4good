'use server';
import prisma, { GetUser, Organization, User } from '@/lib/prisma';
//import { forbidden } from 'next/navigation';

/**
 * Update the organization with the given values
 * @param {number} organizationId the id of the organization
 * @param {string} name the name of the organization
 * @param {string | null} description the description of the organization
 * @param {string} address the address of the organization
 * @param {string} postcode the postcode of the organization
 * @returns {Promise<{ success: boolean; message: string; organization?: Organization }>} - The updated organization.
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

  const exists = await prisma.organization.findUnique({
    where: {
      name: name,
    },
  });

  if (exists && exists.id !== organizationId && exists.name === name) {
    // Check if the name already exists and is not the same as the current organization
    console.warn(
      `User ${user.id} attempted to rename organization ${organizationId} to "${name}", but that name is already taken by organization ${exists.id}.`,
    );
    return {
      success: false,
      message: `Organization name "${name}" is already taken. Please choose a different name.`,
    };
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
    throw new Error('Failed to update organization due to a server error.');
  }
}

/**
 * Add a member to the organization
 * @param {number} organizationId the id of the organization
 * @param {string} memberIdentifier the username of the member to add
 * @returns {Promise<{ success: boolean; message: string; member?: User; organization?: Organization }>} - The updated organization.
 */
export async function AddMemberToOrganization(organizationId: number, memberIdentifier: string) {
  const user = await GetUser(true);
  if (!user) {
    return { success: false, message: 'Authentication required.' };
  }

  // Check ownership based on the organization ID passed in
  const organizationToUpdate = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: { owner: true, members: true },
  });

  if (!organizationToUpdate) {
    return { success: false, message: 'Organization not found.' };
  }

  if (organizationToUpdate.owner.id !== user.id) {
    return { success: false, message: 'Permission denied. Only the owner can add members.' };
  }

  const userToAdd = await prisma.user.findUnique({
    where: { username: memberIdentifier },
  });

  if (!userToAdd) {
    return { success: false, message: `User with identifier '${memberIdentifier}' not found.` };
  }

  const isAlreadyMember = organizationToUpdate.members.some((member) => member.id === userToAdd.id);
  if (isAlreadyMember) {
    return {
      success: false,
      message: `${userToAdd.username} is already a member of this organization.`,
    };
  }
  // Check if the user to add is the owner themselves (owner is usually considered a member implicitly)
  if (organizationToUpdate.owner.id === userToAdd.id) {
    return {
      success: false,
      message: `${userToAdd.username} is the owner and is already associated with this organization.`,
    };
  }

  try {
    // Using the connect operation on the many-to-many relation
    const updatedOrganization = await prisma.organization.update({
      where: { id: organizationId },
      data: {
        members: {
          connect: { id: userToAdd.id },
        },
      },

      include: {
        owner: true,
        members: true,
        followers: true,
      },
    });

    console.log(
      `User ${userToAdd.username} added as a member to organization ${organizationToUpdate.name} (ID: ${organizationId}) by user ${user.id}.`,
    );

    return {
      success: true,
      message: `${userToAdd.username} added as a member successfully.`,
      member: userToAdd as User,
      organization: updatedOrganization,
    };
  } catch (error) {
    console.error('Error adding member to organization:', error);
    throw new Error('Failed to add member due to a server error.');
  }
}

/**
 * Remove a member from the organization. Only the owner can remove members.
 * @param {number} organizationId organizationId to remove member from
 * @param {number} memberIdToRemove memberId to remove
 * @returns {Promise<{ success: boolean; message: string }>} - The result of the operation.
 */
export async function RemoveMemberFromOrganization(
  organizationId: number,
  memberIdToRemove: number,
) {
  const user = await GetUser(true);
  if (!user) {
    return { success: false, message: 'Authentication required.' };
  }

  // Check ownership based on the organization ID passed in
  const organizationToUpdate = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: { owner: true, members: true },
  });

  if (!organizationToUpdate) {
    return { success: false, message: 'Organization not found.' };
  }

  if (organizationToUpdate.owner.id !== user.id) {
    return { success: false, message: 'Permission denied. Only the owner can remove members.' };
  }

  // Prevent the owner from removing themselves
  if (user.id === memberIdToRemove) {
    return { success: false, message: 'You cannot remove yourself as the owner.' };
  }

  const isMember = organizationToUpdate.members.some((member) => member.id === memberIdToRemove);
  if (!isMember) {
    return { success: false, message: 'User is not a member of this organization.' };
  }

  try {
    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        members: {
          disconnect: { id: memberIdToRemove },
        },
      },
    });

    console.log(
      `User ${memberIdToRemove} removed from organization ${organizationToUpdate.name} (ID: ${organizationId}) by owner ${user.id}.`,
    );

    return { success: true, message: 'Member removed successfully.' };
  } catch (error) {
    console.error('Error removing member from organization:', error);
    throw new Error('Failed to remove member due to a server error.');
  }
}
