import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { GetUser } from '@/lib/prisma';
import { imagekit } from '@/lib/imagekit';

/**
 * Handles PUT requests to update the authenticated user's profile picture.
 * Requires a JSON body with `imageUrl` and optional `fileId`.
 * @param {NextRequest} req - The incoming request containing the new picture data.
 * @returns {Promise<NextResponse>} A JSON response indicating successful update or an error (unauthorized, invalid input).
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
 * Handles DELETE requests to remove the authenticated user's profile picture.
 * Deletes the image from ImageKit (if fileId exists) and clears DB references.
 * @returns {Promise<NextResponse>} A JSON response indicating success or an unauthorized error.
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
 * Handles GET requests to fetch the authenticated user's profile picture URL.
 * @returns {Promise<NextResponse>} A JSON response containing the profile picture URL or an unauthorized error.
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
