import { getUploadAuthParams } from '@imagekit/next/server';
import { NextResponse } from 'next/server';

/**
 * Handles GET requests to retrieve authentication parameters for ImageKit direct uploads.
 * Provides necessary token, expire time, signature, and public key for client-side uploads.
 * @returns {Promise<NextResponse>} A JSON response with ImageKit upload authentication parameters.
 */
// eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/naming-convention
export async function GET(): Promise<NextResponse> {
  const { token, expire, signature } = getUploadAuthParams({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  });

  return NextResponse.json({
    token,
    expire,
    signature,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  });
}
