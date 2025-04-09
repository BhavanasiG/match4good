import { NextResponse } from 'next/server';

async function getManagementApiToken() {
  const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      grant_type: 'client_credentials'
    })
  });

  const data = await response.json();
  return data.access_token;
}

export async function DELETE(request : Request, { params }: { params: { user_id: string } }) {
  try {
    const { user_id } = await params;

    /* Get user token */
    const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
        grant_type: 'client_credentials'
      })
    });
  
    const data = await response.json();

    if (!data.access_token) {
      console.error('Error getting access token:', data);
      throw new Error("Failed to get access token");
    }

    const delete_response = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${user_id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${await getManagementApiToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!delete_response.ok) {
      const error = await delete_response.json();
      console.error('Error deleting user:', error);
    }

    return NextResponse.json(
      { success: true }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500}
    );
  }
}