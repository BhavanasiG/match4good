'use server';

import prisma, { GetUser, User } from '@/lib/prisma';
import { forbidden } from 'next/navigation';
/* eslint-disable @typescript-eslint/naming-convention */

type Auth0ErrorResponse = {
  statusCode?: number;
  error?: string;
  message?: string;
  errorCode?: string;
  // Include other known properties Auth0 might return or allow any extra properties
  [key: string]: unknown;
};

type Auth0UpdateOtherFieldsBody = {
  name?: string; // Conditional update for Auth0 'name'
  picture?: string; // Conditional update for Auth0 'picture'
};

type Auth0UpdateEmailBody = {
  email?: string; // Update for Auth0 'email'
};

/**
 * Helper function to check if a string is likely an email address (basic check).
 * You might want a more robust validator depending on strictness requirements.
 * @param {string | null | undefined} str - The string to check.
 * @returns {boolean} True if the string looks like an email, false otherwise.
 */
function looksLikeEmail(str: string | null | undefined): boolean {
  if (!str || typeof str !== 'string') {
    return false;
  }
  // Basic regex - checks for presence of @ and at least one dot after @
  return /\S+@\S+\.\S+/.test(str);
}

/**
 * Updates the user's profile
 * Does NOT attempt to update the username field in Auth0.
 * Does NOT attempt to update the profile picture field in Auth0.
 * @param {string} username - The new username
 * @param {string} email - The new email
 * @param {string | null} bio - The new bio
 * @returns {Promise<void>} - Returns a promise that resolves when the user is updated
 */
export async function UpdateUser(username: string, email: string, bio: string | null) {
  const user = await GetUser();

  if (!user) {
    return;
  }
  const tokenResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      grant_type: 'client_credentials',
    }),
  });
  const tokenData = (await tokenResponse.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!tokenData.access_token) {
    console.error(
      'Error getting Auth0 Management API access token:',
      tokenData.error_description || tokenData.error || 'Unknown error',
    );
    throw new Error('Failed to get Auth0 Management API access token.');
  }

  const accessToken = tokenData.access_token;
  //console.log('Successfully obtained Auth0 Management API access token.');

  // --- Fetch user profile from Auth0 to get current 'name' ---
  // This is necessary to check if the current Auth0 'name' looks like an email.
  console.log(`Workspaceing user profile from Auth0 for userId: ${user.userId}`);
  const auth0UserResponse = await fetch(
    `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${user.userId}`,
    {
      method: 'GET', // Use GET method
      headers: {
        Authorization: `Bearer ${accessToken}`, // Use the access token
      },
    },
  );

  if (!auth0UserResponse.ok) {
    // Handle error if fetching Auth0 user profile fails
    const errorBody = await auth0UserResponse.text();
    let errorDetails = `Auth0 API returned status ${auth0UserResponse.status} when fetching user profile.`;
    try {
      const jsonError = JSON.parse(errorBody) as Auth0ErrorResponse;
      errorDetails += ` Message: ${jsonError.message || 'N/A'}. Error: ${jsonError.error || 'N/A'}.`;
      if (jsonError.errorCode) {
        errorDetails += ` Error Code: ${jsonError.errorCode}.`;
      }
      console.error('Full Auth0 Error Response Body (GET User):', jsonError);
    } catch {
      errorDetails += ` Raw Body: ${errorBody}`;
      console.error('Could not parse Auth0 error body (GET User) as JSON. Raw body:', errorBody);
    }
    console.error(`Error fetching user profile from Auth0:`, errorDetails);
    throw new Error(`Failed to fetch user profile from Auth0: ${errorDetails}`);
  }

  // Parse the full Auth0 user profile object
  const auth0User = (await auth0UserResponse.json()) as { name?: string };
  console.log(
    `Successfully fetched user profile from Auth0. Current Auth0 name: ${auth0User.name}`,
  );

  // --- Prepare Update Bodies for Auth0 (Split into potentially two calls) ---
  // We are NOT including the 'username' field in the Auth0 update bodies.

  // Body for fields other than email (username, picture)
  const updateOtherFieldsBody: Auth0UpdateOtherFieldsBody = {};
  let needsOtherFieldsUpdate = false; // Flag to track if we need to send a body to Auth0

  // Body specifically for email update
  const updateEmailBody: Auth0UpdateEmailBody = {};
  let needsEmailUpdate = false;

  const currentAuth0Name = auth0User.name;
  const localAppUsername = username;

  if (looksLikeEmail(currentAuth0Name) && localAppUsername !== currentAuth0Name) {
    console.log(
      `Current Auth0 name '${currentAuth0Name}' looks like an email and differs from local username '${localAppUsername}'. Including 'name' update in Auth0 body.`,
    );
    updateOtherFieldsBody.name = localAppUsername;
    needsOtherFieldsUpdate = true;
  } else {
    console.log(
      `Auth0 name is not an email OR matches local username. Not including 'name' update in Auth0 body.`,
    );
  }

  // // Add picture to update body if it exists locally (syncing local URL to Auth0)
  // // Only include the 'picture' field if user.profilePictureUrl has a value in our DB.
  // // We don't explicitly unset it here
  // // if user.profilePictureUrl becomes null in our DB (that might require sending { picture: null }).
  // if (user.profilePictureUrl) {
  //   // Add the 'picture' field to the root of the update body object
  //   updateOtherFieldsBody.picture = user.profilePictureUrl;
  //   needsOtherFieldsUpdate = true; // We are intending to update the picture field
  // }

  // Check if email needs updating (prepare its separate body)
  if (email !== user.email) {
    updateEmailBody.email = email;
    needsEmailUpdate = true;
    // Note: Updating email might require email verification depending on our Auth0 settings.
  }

  // Only attempt to update Auth0 if there are fields added to the update body
  // Ensure the final auth0UpdateBody object is not empty before sending the request.
  // Update fields other than email (username, picture)
  // Only send the request if there are fields in updateOtherFieldsBody
  if (needsOtherFieldsUpdate && Object.keys(updateOtherFieldsBody).length > 0) {
    console.log(
      'Updating other fields in Auth0 with body:',
      JSON.stringify(updateOtherFieldsBody, null, 2),
    );
    const updateOtherResponse = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${user.userId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateOtherFieldsBody),
      },
    );

    if (!updateOtherResponse.ok) {
      const errorBody = await updateOtherResponse.text();
      let errorDetails = `Auth0 API returned status ${updateOtherResponse.status} when updating other fields.`;
      try {
        const jsonError = JSON.parse(errorBody) as Auth0ErrorResponse;
        errorDetails += ` Message: ${jsonError.message || 'N/A'}. Error: ${jsonError.error || 'N/A'}.`;
        if (jsonError.errorCode) {
          errorDetails += ` Error Code: ${jsonError.errorCode}.`;
        }
        console.error('Full Auth0 Error Response Body (Other Fields):', jsonError);
      } catch {
        errorDetails += ` Raw Body: ${errorBody}`;
        console.error(
          'Could not parse Auth0 error body (Other Fields) as JSON. Raw body:',
          errorBody,
        );
      }
      console.error(`Error updating other fields in Auth0:`, errorDetails);
      // Throwing stops the entire process if the first update fails
      throw new Error(`Failed to update user in Auth0 (other fields): ${errorDetails}`);
    }
    console.log('Successfully updated other fields in Auth0.');
  } else {
    console.log('No other Auth0 fields to update.');
  }

  // Update email (if needed)
  // Only send the request if there are fields in updateEmailBody (i.e., if email changed)
  if (needsEmailUpdate && Object.keys(updateEmailBody).length > 0) {
    console.log('Updating email in Auth0 with body:', JSON.stringify(updateEmailBody, null, 2));
    const updateEmailResponse = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${user.userId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateEmailBody),
      },
    );

    if (!updateEmailResponse.ok) {
      const errorBody = await updateEmailResponse.text();
      let errorDetails = `Auth0 API returned status ${updateEmailResponse.status} when updating email.`;
      try {
        const jsonError = JSON.parse(errorBody) as Auth0ErrorResponse;
        errorDetails += ` Message: ${jsonError.message || 'N/A'}. Error: ${jsonError.error || 'N/A'}.`;
        if (jsonError.errorCode) {
          errorDetails += ` Error Code: ${jsonError.errorCode}.`;
        }
        console.error('Full Auth0 Error Response Body (Email):', jsonError);
      } catch {
        errorDetails += ` Raw Body: ${errorBody}`;
        console.error('Could not parse Auth0 error body (Email) as JSON. Raw body:', errorBody);
      }
      console.error(`Error updating email in Auth0:`, errorDetails);
      // Throwing indicates a failure to update email in Auth0
      throw new Error(`Failed to update user in Auth0 (email): ${errorDetails}`);
    }
    console.log('Successfully updated email in Auth0.');
  } else {
    console.log('Email does not need updating.');
  }
  await prisma.user.update({
    where: {
      userId: user.userId,
    },
    data: {
      username: username,
      email: email,
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
  const user = await GetUser();

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
  const user: User | null = await GetUser();

  if (!user) {
    return forbidden();
  }

  const organizations = await prisma.organization.findMany({
    where: {
      ownerId: user.id,
    },
  });

  if (organizations.length > 0) {
    throw new Error('Cannot delete user who owns any organizations');
  }

  const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      grant_type: 'client_credentials',
    }),
  });

  const data = (await response.json()) as { access_token: string };

  if (!data.access_token) {
    console.error('Error getting access token:', data);
    throw new Error('Failed to get access token');
  }

  const delete_response = await fetch(
    `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${user.userId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${data.access_token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!delete_response.ok) {
    const error = (await delete_response.json()) as string;
    throw new Error('Error deleting user (AUTH0):' + error);
  }

  await prisma.user.delete({
    where: {
      id: user.id,
    },
  });

  return true;
}
