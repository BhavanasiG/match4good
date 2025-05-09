import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { GetUser } from '@/lib/prisma';

/**
 * Handles the GET request for retrieving organization details.
 * @param {NextRequest} req - The incoming request object.
 * @param {object} context - Context object containing params.
 * @param {Promise<{ id: string }>} context.params - The dynamic route params.
 * @returns {Promise<NextResponse>} - The response object containing organization data.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const resolvedParams = await context.params; // ✅ Unwrap the params promise
  const orgId = parseInt(resolvedParams.id);

  if (isNaN(orgId)) {
    return NextResponse.json({ error: 'Invalid organization ID' }, { status: 400 });
  }

  const organization = await prisma.organization.findUnique({
    where: { id: orgId },
  });

  if (!organization) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
  }

  return NextResponse.json(organization);
}

/**
 * Handles the PUT request to update an organization's details.
 * @param {NextRequest} req - The incoming request object.
 * @param {object} context - Context object containing params.
 * @param {Promise<{ id: string }>} context.params - The dynamic route params.
 * @returns {Promise<NextResponse>} - The response object containing success or error message.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await GetUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resolvedParams = await context.params; // ✅ Unwrap the params promise
  const orgId = parseInt(resolvedParams.id);
  const body = (await req.json()) as {
    name: string;
    description?: string;
    address: string;
    postcode: string;
  }; // ✅ Explicitly typed request body

  // Validate input
  if (!body.name || typeof body.name !== 'string') {
    return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
  }

  // Check if user is the owner
  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  if (!org || org.ownerId !== user.id) {
    return NextResponse.json(
      { error: 'Forbidden: You cannot edit this organization' },
      { status: 403 },
    );
  }

  // Update organization details
  const updatedOrg = await prisma.organization.update({
    where: { id: orgId },
    data: {
      name: body.name,
      description: body.description,
      address: body.address,
      postcode: body.postcode,
    },
  });

  return NextResponse.json({ success: 'Organization updated', data: updatedOrg });
}
