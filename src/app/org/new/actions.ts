"use server";

import prisma, { getUser } from "@/lib/prisma";
import { forbidden, redirect } from "next/navigation";

export interface CreateOrgFormData {
  name: string;
  description?: string;
}

/**
 * Create a new organization for the logged in user with the given information.
 * If any parameters are invalid it returns an error string.
 * @param {CreateOrgFormData} form_data Data to create the org with
 * @returns {Promise<string | redirect>} Returns an error string, or redirects the page
 */
export async function createOrg(form_data: CreateOrgFormData) {
  const user = await getUser();

  if (!user) {
    return forbidden();
  }

  if (form_data.name.trim() === "") {
    return "name cannot be empty";
  }

  const org = await prisma.organization.create({
    data: {
      name: form_data.name,
      description: form_data.description,
      owner_id: user.id,
    },
  });

  return redirect(`/org/${org.id}`);
}
