import { PrismaClient, Prisma } from '../../generated/prisma_client/index.js';
import { auth0 } from './auth0.ts';

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export type User = Prisma.UserGetPayload<{
  include: { ownerOf: true; memberOf: true };
}>;

export type Organization = Prisma.OrganizationGetPayload<{
  include: { owner: true; members: true; followers: true };
}>;

export type Region = Prisma.RegionGetPayload<{ include: { users: true; organizations: true } }>;

// Define the type for the Organization payload with specific includes and selects
export type OrganizationWithSelectedRelations = Prisma.OrganizationGetPayload<{
  include: {
    owner: {
      select: {
        id: true;
        userId: true;
        username: true;
        email: true;
        profilePictureUrl: true;
      };
    };
    members: {
      select: {
        id: true;
        userId: true;
        username: true;
        email: true;
        profilePictureUrl: true;
      };
    };
    followers: true;
  };
  select: {
    // top-level scalar fields and picture fields
    id: true;
    name: true;
    description: true;
    address: true;
    postcode: true;
    regionId: true;
    ownerId: true;
    orgPictureUrl: true;
    orgPictureFileId: true;
    bannerPictureUrl: true;
    bannerPictureFileId: true;
  };
}>;

/**
 * Helper function to get the currently logged in user from the auth0 session infomation.
 * If the user didn't exist in the database before, a new record is created.
 * @param {boolean} organizations Include related organizations
 * @returns {User} User if logged in, otherwise null
 */
export async function GetUser(organizations: boolean = false): Promise<User | null> {
  const session = await auth0.getSession();
  if (!session) {
    return null;
  }

  let user = await prisma.user.findUnique({
    where: { userId: session.user.sub },
    include: {
      ownerOf: organizations,
      memberOf: organizations,
    },
  });

  let userName = null;
  const email = session.user.email;

  if (!user) {
    if (session.user.name && session.user.name.includes(' ')) {
      userName = session.user.name;
    }
    const username = userName ?? session.user.nickname ?? session.user.sub;
    const initialProfilePictureUrl: string | null | undefined = session.user.picture;

    user = await prisma.user.create({
      data: {
        userId: session.user.sub,
        username: username,
        email: email,
        profilePictureUrl: initialProfilePictureUrl,
      },
      include: {
        ownerOf: organizations,
        memberOf: organizations,
      },
    });
  }

  return user;
}

/**
 * Checks if the user has completed the signup process
 * by verifying if the user has selected at least 3 interests.
 * @returns {boolean} True if the user has completed the signup process, otherwise false
 */
export async function SignupComplete() {
  const user = await GetUser();
  if (!user) {
    return false;
  }
  return user.signupCompleted;
}
