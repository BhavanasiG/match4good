// app/api/unfollow/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/prisma";
import prisma from "@/lib/prisma";

/* eslint-disable @typescript-eslint/naming-convention */

/**
 * POST handler for following an organization.
 * @param {Request} req - HTTP request object containing JSON body with organizationId.
 * @returns {Promise<Response>} JSON response with success or error message.
 */
export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as { organizationId: number };
  const { organizationId } = body;

  await prisma.follow.deleteMany({
    where: {
      userId: user.id,
      organizationId: organizationId,
    },
  });

  return NextResponse.json({ success: true });
}
