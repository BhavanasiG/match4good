"use server";

import prisma, { getUser } from "@/lib/prisma";
import { forbidden } from "next/navigation";

/**
 *
 * @param {string} username - Accepts a username string
 * @returns {Promise<void>} - Returns a promise that resolves when the user is updated
 */

/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Updates the user's username and bio
 * @param {string} username - The new username
 * @param {string | null} bio - The new bio
 * @returns {Promise<void>} - Returns a promise that resolves when the user is updated
 */
export async function UpdateUser(username: string, bio: string | null) {
  const user = await getUser();

  if (!user) {
    return;
  }

  await prisma.user.update({
    where: {
      user_id: user.user_id,
    },
    data: {
      username: username,
      bio: bio,
    },
  });
}

/**
 *
 * @param {number} org - Accepts an organization id
 * @returns {Promise<void>} - Returns a promise that resolves when the organization is deleted
 */
export async function DeleteOrganization(org: number) {
  const user = await getUser();

  if (!user) {
    return forbidden();
  }

  await prisma.organization.delete({
    where: {
      id: org,
    },
  });
}

/**
 *
 * @returns {Promise<void>} - Returns a promise that resolves when the user is updated
 */
export async function DeleteUser() {
  const user = await getUser();

  if (!user) {
    return forbidden();
  }

  const organizations = await prisma.organization.findMany({
    where: {
      owner_id: user.id,
    },
  });

  if (organizations.length > 0) {
    throw new Error("Cannot delete user who owns any organizations");
  }

  const response = await fetch(
    `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
        grant_type: "client_credentials",
      }),
    },
  );

  const data = (await response.json()) as { access_token: string };

  if (!data.access_token) {
    console.error("Error getting access token:", data);
    throw new Error("Failed to get access token");
  }

  const delete_response = await fetch(
    `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${user.user_id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${data.access_token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!delete_response.ok) {
    const error = (await delete_response.json()) as string;
    throw new Error("Error deleting user (AUTH0):" + error);
  }

  await prisma.user.delete({
    where: {
      id: user.id,
    },
  });

  return true;
}
