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

export type Props = {
  name: string;
  description: string;
  address: string;
  postcode: string;
};

/**
 *
 * @param {string} param0 - Accepts an object with a username string
 * @returns {Promise<void>} - Returns a promise that resolves when the user is updated
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

  if (exists) {
    return 0;
  } else {
    const org = await prisma.organization.create({
      data: {
        name: name,
        description: description,
        address: address,
        postcode: postcode,
        ownerId: user.id,
      },
    });

    return org.id;
  }
}
