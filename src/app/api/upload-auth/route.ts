import { getUploadAuthParams } from '@imagekit/next/server';

/**
 * This function handles the GET request to retrieve upload authentication parameters for ImageKit.
 * @returns {Promise<Response>} - Returns a promise that resolves to a response object containing the upload authentication parameters.
 */
// eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/naming-convention
export async function GET() {
  const { token, expire, signature } = getUploadAuthParams({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  });

  return Response.json({
    token,
    expire,
    signature,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  });
}
