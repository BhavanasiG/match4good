"use server";

import prisma, { getUser } from "@/lib/prisma";
import { forbidden, redirect } from "next/navigation";

export interface CreateOrgFormData {
  name: string;
  description?: string;
  address: string;
  postcode: string;
}

/**
<<<<<<< HEAD
<<<<<<< HEAD
 * Create a new organization for the logged-in user with the given information.
 * If any parameters are invalid, it returns an error string.
 *
 * @param form_data Data to create the org with
 * @returns Returns an error string, or redirects the page
=======
=======
>>>>>>> 8d560df8127ce8f6424e0dac1cfda4e1cbdae810
 * Create a new organization for the logged in user with the given information.
 * If any parameters are invalid it returns an error string.
 * @param {CreateOrgFormData} form_data Data to create the org with
 * @returns {Promise<string | redirect>} Returns an error string, or redirects the page
<<<<<<< HEAD
>>>>>>> e43f3a1 (Added comments V1)
=======
>>>>>>> 8d560df8127ce8f6424e0dac1cfda4e1cbdae810
 */
export async function createOrg(form_data: CreateOrgFormData) {
  const user = await getUser();

  if (!user) {
    return forbidden();
  }

  if (form_data.name.trim() === "") {
    return "Name cannot be empty";
  }

  if (form_data.address.trim() === "") {
    return "Address cannot be empty";
  }

  if (form_data.postcode.trim() === "") {
    return "Postcode cannot be empty";
  }

  const org = await prisma.organization.create({
    data: {
      name: form_data.name,
      description: form_data.description,
      address: form_data.address,
      postcode: form_data.postcode,
      owner_id: user.id,
    },
  });

  return redirect(`/org/${org.id}`);
}
