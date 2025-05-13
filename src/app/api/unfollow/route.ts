// app/api/unfollow/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { GetUser } from '@/lib/prisma';
import prisma from '@/lib/prisma';

/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Handles POST requests to unfollow an organization.
 * Deletes the follow relationship between the user and the organization.
 * @param {NextRequest} req - The incoming request object with organizationId in JSON body.
 * @returns {Promise<NextResponse>} A JSON response indicating success or unauthorized error.
 */
export async function POST(req: NextRequest) {
  const user = await GetUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
