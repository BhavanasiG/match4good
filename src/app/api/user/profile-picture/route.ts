import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { GetUser } from '@/lib/prisma';
import { imagekit } from '@/lib/imagekit';

/**
 * This function handles the PUT request to update the user's profile picture.
 * It checks if the user is authenticated, and if so, updates the profile picture URL in the database.
 * @param {NextRequest} req - The incoming request object
 * @returns {Promise<Response>} - The response object
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export async function PUT(req: NextRequest) {
  const user = await GetUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  type ProfilePictureUpdateBody = {
    imageUrl: string;
    fileId?: string;
  };

  const body = (await req.json()) as ProfilePictureUpdateBody;
  const { imageUrl, fileId } = body;

  if (typeof imageUrl !== 'string') {
    return new Response('Invalid image URL', { status: 400 });
  }

  await prisma.user.update({
    where: { userId: user.userId },
    data: { profilePictureUrl: imageUrl, profilePictureFileId: fileId },
  });

  return NextResponse.json({ error: 'Profile picture updated' }, { status: 200 });
}

/**
 *
 * @returns {Promise<Response>} - The response object indicating success
 * @throws {Response} - Throws a 401 Unauthorized response if the user is not authenticated
 * This function handles the DELETE request to remove the user's profile picture.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export async function DELETE() {
  const user = await GetUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { userId: user.userId },
    select: { profilePictureFileId: true },
  });

  // Delete image from ImageKit if a fileId exists
  if (dbUser?.profilePictureFileId) {
    try {
      await imagekit.deleteFile(dbUser.profilePictureFileId);
    } catch (err) {
      console.error('Failed to delete from ImageKit:', err);
    }
  }

  // Remove from DB
  await prisma.user.update({
    where: { userId: user.userId },
    data: {
      profilePictureUrl: null,
      profilePictureFileId: null,
    },
  });

  return NextResponse.json({ success: true });
}

/**
 * This function handles the GET request to fetch the user's profile picture.
 * It checks if the user is authenticated, and if so, retrieves the profile picture URL from the database.
 * @returns {Promise<Response>} - The response object containing the profile picture URL
 * @throws {Response} - Throws a 401 Unauthorized response if the user is not authenticated
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export async function GET() {
  const user = await GetUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { userId: user.userId },
    select: { profilePictureUrl: true },
  });

  return Response.json({ profilePictureUrl: dbUser?.profilePictureUrl ?? null });
}
