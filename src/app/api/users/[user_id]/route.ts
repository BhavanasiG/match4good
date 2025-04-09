import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * REST function which handles Auth0 & Prisma.js
 * account deletion.
 * @param request accepts a request
 * @param params accepts a JSON object containing an Auth0 user_id string
 * @returns NextResponse
 */

export async function DELETE(
  request: Request,
  { params }: { params: { user_id: string } },
) {
  try {
    const { user_id } = params;

    /* Get user token */
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

    const data = await response.json();

    if (!data.access_token) {
      console.error("Error getting access token:", data);
      throw new Error("Failed to get access token");
    }

    const delete_response = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${user_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${data.access_token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!delete_response.ok) {
      const error = await delete_response.json();
      throw new Error("Error deleting user (AUTH0):", error);
    }

    const account = await prisma.user.findUnique({
      where: {
        user_id: user_id,
      },
    });

    if (account === null) {
      console.log("\nAYE\n");
      throw new Error("Failed to delete account in prisma");
    } else {
      console.log("\nYOOOO\n");
      await prisma.user.delete({
        where: {
          user_id: user_id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
