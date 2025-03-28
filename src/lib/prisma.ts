import { PrismaClient, Prisma } from "@/../generated/prisma_client";
import { auth0 } from "@/lib/auth0";

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/naming-convention
const globalForPrisma = global as unknown as { prisma: typeof prisma };

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export type User = Prisma.UserGetPayload<{
  include: { owner_of: true; member_of: true };
}>;

/**
 * Helper function to get the currently logged in user from the auth0 session infomation.
 * If the user didn't exist in the database before, a new record is created.
 *
 * @param organizations Include related organizations
 * @returns User if logged in, otherwise null
 */
export async function getUser(
  organizations: boolean = false
): Promise<User | null> {
  const session = await auth0.getSession();
  if (!session) {
    return null;
  }

  let user = await prisma.user.findUnique({
    where: { user_id: session.user.sub },
    include: {
      owner_of: organizations,
      member_of: organizations,
    },
  });

  let user_name = null;
  const email = session.user.email;

  if (!user) {
    if (session.user.name && session.user.name.includes(" ")) {
      user_name = session.user.name;
    }
    const username = user_name ?? session.user.nickname ?? session.user.sub;

    user = await prisma.user.create({
      data: {
        user_id: session.user.sub,
        username: username,
        email: email,
      },
      include: {
        owner_of: organizations,
        member_of: organizations,
      },
    });
  }

  return user;
}

export default prisma;
