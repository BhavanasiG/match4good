// app/api/follow/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/prisma";

/* eslint-disable @typescript-eslint/naming-convention */

/**
 * POST handler for following an organization.
 * @param {Request} req - HTTP request object containing JSON body with organizationId.
 * @returns {Promise<Response>} JSON response with success or error message.
 */
export async function POST(req: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { organizationId: number };
  const { organizationId } = body;

  try {
    await prisma.follow.create({
      data: {
        userId: user.id,
        organizationId: organizationId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error following organization:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
