/**
 * Creates an organisation
 * @param name Accepts a name string
 * @param description Accepts a description string
 * @param address Accepts an address string
 * @param postcode Accepts a postcode string
 * @returns {number} Returns the id of the created organization
 * @throws {Error} Throws a forbidden if the user is not authenticated
 */

"use server";

import prisma, { getUser } from "@/lib/prisma";
import { forbidden, redirect } from "next/navigation";

export type Props = { name: string, description: string, address: string, postcode: string };

/**
 *
 * @param {string} param0 - Accepts an object with a username string
 * @returns {Promise<void>} - Returns a promise that resolves when the user is updated
 */
export async function CreateOrganization({ name, description, address, postcode }: Props) {
  const user = await getUser();

  if (!user) {
    return forbidden();
  }

  const org = await prisma.organization.create({
    data: {
      name: name,
      description: description,
      address: address,
      postcode: postcode,
      owner_id: user.id,
    },
  });

  return redirect(`/org/${org.id}`);
}
