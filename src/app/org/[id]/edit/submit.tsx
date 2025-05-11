'use server';
import prisma, { GetUser, Organization, User } from '@/lib/prisma';
import { imagekit } from '@/lib/imagekit';
import { getUploadAuthParams } from '@imagekit/next/server';
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
 * Server Action to generate authentication parameters for ImageKit client-side direct upload for organization images.
 * Requires the user to be logged in.
 * @returns {Promise<{ success: boolean; message?: string; auth?: { token: string; expire: number; signature: string; publicKey: string } }>} - Authentication parameters or error result.
 */
export async function GetOrgImageUploadAuth() {
  // Basic check if user is logged in. Owner check happens in update/delete actions.
  const user = await GetUser();
  if (!user) {
    return { success: false, message: 'Authentication required to generate upload parameters.' };
  }

  try {
    const authParams = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
    });

    return {
      success: true,
      auth: {
        token: authParams.token,
        expire: authParams.expire,
        signature: authParams.signature,
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
      },
    };
  } catch (error) {
    console.error('Error generating ImageKit upload auth params:', error);
    // *** Throw for unexpected errors during auth param generation ***
    throw new Error('Failed to generate image upload parameters due to a server error.');
  }
}

/**
 * Server Action to remove an organization's profile picture.
 * Deletes the file from ImageKit and clears the database fields.
 * Requires the user to be the organization owner.
 * @param {number} organizationId - The ID of the organization.
 * @returns {Promise<{ success: boolean; message: string }>} - Result of the operation.
 */
export async function RemoveOrgProfilePicture(organizationId: number) {
  const user = await GetUser();
  if (!user) {
    return { success: false, message: 'Authentication required.' };
  }

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { id: true, name: true, owner: { select: { id: true } }, orgPictureFileId: true }, // Select fields needed
  });

  if (!organization) {
    return { success: false, message: 'Organization not found.' };
  }

  if (organization.owner.id !== user.id) {
    return {
      success: false,
      message: 'Permission denied. Only the owner can remove the profile picture.',
    };
  }

  const fileIdToRemove = organization.orgPictureFileId;

  if (fileIdToRemove) {
    try {
      console.log(
        `Attempting to delete ImageKit file: ${fileIdToRemove} for organization ${organization.name} (ID: ${organizationId})`,
      );
      await imagekit.deleteFile(fileIdToRemove);
      console.log(`Successfully deleted ImageKit file: ${fileIdToRemove}`);
    } catch (error) {
      console.error(
        `Failed to delete ImageKit file ${fileIdToRemove} for organization ${organizationId}:`,
        error,
      );
      // What should happen if we want to fail the *entire* operation if ImageKit deletion fails?
      // For now, we'll log the error but still clear the DB fields to avoid orphaned file IDs.
      // throw new Error('Failed to delete the image file from storage.'); // Option to fail hard
    }
  } else {
    console.warn(
      `Attempted to remove profile picture for organization ${organizationId} but no profilePictureFileId found in DB.`,
    );
    // This might happen if the DB field was already null, which is fine.
  }

  try {
    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        orgPictureUrl: null,
        orgPictureFileId: null,
      },
    });
    console.log(`Profile picture fields cleared in DB for organization ${organizationId}.`);
    return { success: true, message: 'Organization profile picture removed successfully.' };
  } catch (error) {
    console.error('Error clearing profile picture fields in DB:', error);
    throw new Error('Failed to update organization database record after image removal.');
  }
}

/**
 * Server Action to remove an organization's banner picture.
 * Deletes the file from ImageKit and clears the database fields.
 * Requires the user to be the organization owner.
 * @param {number} organizationId - The ID of the organization.
 * @returns {Promise<{ success: boolean; message: string }>} - Result of the operation.
 */
export async function RemoveOrgBannerPicture(organizationId: number) {
  const user = await GetUser();
  if (!user) {
    return { success: false, message: 'Authentication required.' };
  }

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { id: true, name: true, owner: { select: { id: true } }, bannerPictureFileId: true }, // Select fields needed
  });

  if (!organization) {
    return { success: false, message: 'Organization not found.' };
  }

  if (organization.owner.id !== user.id) {
    return {
      success: false,
      message: 'Permission denied. Only the owner can remove the banner picture.',
    };
  }

  const fileIdToRemove = organization.bannerPictureFileId;

  if (fileIdToRemove) {
    try {
      console.log(
        `Attempting to delete ImageKit file: ${fileIdToRemove} for organization ${organization.name} (ID: ${organizationId})`,
      );
      await imagekit.deleteFile(fileIdToRemove);
      console.log(`Successfully deleted ImageKit file: ${fileIdToRemove}`);
    } catch (error) {
      console.error(
        `Failed to delete ImageKit file ${fileIdToRemove} for organization ${organizationId}:`,
        error,
      );
      // Log the error but continue to clear DB fields
    }
  } else {
    console.warn(
      `Attempted to remove banner picture for organization ${organizationId} but no bannerPictureFileId found in DB.`,
    );
  }

  try {
    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        bannerPictureUrl: null,
        bannerPictureFileId: null,
      },
    });
    console.log(`Banner picture fields cleared in DB for organization ${organizationId}.`);
    return { success: true, message: 'Organization banner picture removed successfully.' };
  } catch (error) {
    console.error('Error clearing banner picture fields in DB:', error);
    throw new Error('Failed to update organization database record after image removal.');
  }
}

/**
 * Server Action to update an organization's profile picture URL and file ID in the database.
 * This action is called after a successful ImageKit upload.
 * Requires the user to be the organization owner.
 * @param {number} organizationId - The ID of the organization.
 * @param {string} orgPictureUrl - The new ImageKit URL for the profile picture.
 * @param {string} orgPictureFileId - The new ImageKit File ID for the profile picture.
 * @returns {Promise<{ success: boolean; message: string }>} - Result of the operation.
 */
export async function UpdateOrgProfilePicture(
  organizationId: number,
  orgPictureUrl: string,
  orgPictureFileId: string,
) {
  const user = await GetUser();
  if (!user) {
    return { success: false, message: 'Authentication required.' };
  }

  // Verify ownership
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { id: true, owner: { select: { id: true } } },
  });
  if (!organization) {
    return { success: false, message: 'Organization not found.' };
  }
  if (organization.owner.id !== user.id) {
    return { success: false, message: 'Permission denied. Only the owner can update pictures.' };
  }

  try {
    // Update the organization record with the new profile picture data
    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        orgPictureUrl: orgPictureUrl,
        orgPictureFileId: orgPictureFileId,
      },
    });
    console.log(
      `Profile picture updated in DB for org ${organizationId} with file ID ${orgPictureFileId}.`,
    );
    return { success: true, message: 'Organization profile picture updated successfully.' };
  } catch (error) {
    console.error('Error updating organization profile picture in DB:', error);
    throw new Error('Failed to update organization profile picture in the database.');
  }
}

/**
 * Server Action to update an organization's banner picture URL and file ID in the database.
 * This action is called after a successful ImageKit upload.
 * Requires the user to be the organization owner.
 * @param {number} organizationId - The ID of the organization.
 * @param {string} bannerPictureUrl - The new ImageKit URL for the banner picture.
 * @param {string} bannerPictureFileId - The new ImageKit File ID for the banner picture.
 * @returns {Promise<{ success: boolean; message: string }>} - Result of the operation.
 */
export async function UpdateOrgBannerPicture(
  organizationId: number,
  bannerPictureUrl: string,
  bannerPictureFileId: string,
) {
  const user = await GetUser();
  if (!user) {
    return { success: false, message: 'Authentication required.' };
  }

  // Verify ownership
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { id: true, owner: { select: { id: true } } },
  });
  if (!organization) {
    return { success: false, message: 'Organization not found.' };
  }
  if (organization.owner.id !== user.id) {
    return { success: false, message: 'Permission denied. Only the owner can update pictures.' };
  }

  try {
    // Update the organization record with the new banner picture data
    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        bannerPictureUrl: bannerPictureUrl,
        bannerPictureFileId: bannerPictureFileId,
      },
    });
    console.log(
      `Banner picture updated in DB for org ${organizationId} with file ID ${bannerPictureFileId}.`,
    );
    return { success: true, message: 'Organization banner picture updated successfully.' };
  } catch (error) {
    console.error('Error updating organization banner picture in DB:', error);
    throw new Error('Failed to update organization banner picture in the database.');
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
