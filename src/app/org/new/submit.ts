/**
 * Creates an organisation
 * @param name Accepts a name string
 * @param description Accepts a description string
 * @param address Accepts an address string
 * @param postcode Accepts a postcode string
 * @returns {number} Returns the id of the created organization
 * @throws {Error} Throws a forbidden if the user is not authenticated
 */

'use server';

import prisma, { GetUser } from '@/lib/prisma';
import { forbidden } from 'next/navigation';
import getRegionFromPostcode from '@/lib/postcodes-io';

/**
 * Interface for the data structure expected by the CreateOrganization Server Action.
 * @property {string} name - The organization's name.
 * @property {string} description - The organization's description.
 * @property {string} address - The organization's address.
 * @property {string} postcode - The organization's postcode.
 */
export type Props = {
  name: string;
  description: string;
  address: string;
  postcode: string;
};

/**
 * Type alias for a simplified Region object used internally.
 * @property {number} id - The region's unique ID.
 * @property {string} name - The region's name.
 * @property {number} points - The region's points.
 */
type Region = {
  id: number;
  name: string;
  points: number;
};

/**
 * Server Action to create a new organization.
 * Checks user authentication, prevents duplicate names, determines region from postcode, and links the organization to the user and region.
 * @param {Props} formData - The data submitted from the new organization form.
 * @returns {Promise<number | void>} Returns the ID of the created organization on success, 0 if the name exists or region is not found, or triggers forbidden() if the user is not authenticated.
 */
export async function CreateOrganization({ name, description, address, postcode }: Props) {
  const user = await GetUser();

  if (!user) {
    return forbidden();
  }

  const exists = await prisma.organization.findUnique({
    where: {
      name: name,
    },
  });

  let orgRegion: Region | null = null;

  if (postcode) {
    orgRegion = await getRegionFromPostcode(postcode);
  } else {
    console.error(`Could not determine region for postcode "${postcode}".`);
    orgRegion = null;
  }

  if (exists) {
    return 0;
  }
  if (orgRegion === null) {
    return 0;
  }
  if (!exists && orgRegion) {
    const org = await prisma.organization.create({
      data: {
        name: name,
        description: description,
        address: address,
        ownerId: user.id,
        postcode: postcode,
        regionId: orgRegion.id,
      },
    });
    console.log('Organization created:', org);
    return org.id;
  }
}
