import prisma, { GetUser, OrganizationWithSelectedRelations, SignupComplete } from '@/lib/prisma';
import EditOrganizationForm from './form';
import { forbidden, notFound, redirect } from 'next/navigation';

export default async function EditOrganization(props: { params: Promise<{ id: string }> }) {
  const org_id = parseInt((await props.params).id, 10);

  if (isNaN(org_id)) {
    return notFound();
  }

  const user = await GetUser(true);

  if (!user) {
    return forbidden();
  }

  if (user) {
    const signupCompleted = await SignupComplete();
    if (!signupCompleted) {
      redirect('/user/sign-up');
    }
  }

  // Include followers and owner in the org query for permissions & buttons
  const org: OrganizationWithSelectedRelations | null = await prisma.organization.findUnique({
    where: { id: org_id },
    include: {
      owner: {
        select: {
          id: true,
          userId: true,
          username: true,
          email: true,
          profilePictureUrl: true,
        },
      },
      members: {
        select: {
          id: true,
          userId: true,
          username: true,
          email: true,
          profilePictureUrl: true,
        },
      },
      followers: true,
    },
  });

  if (org === null) {
    notFound();
  }

  const isOwner = await prisma.organization.findFirst({
    where: {
      name: org.name,
      ownerId: user.id,
    },
  });

  if (!isOwner) {
    return forbidden();
  }

  return (
    <div className="self-center p-12 md:p-24 w-screen max-w-4xl">
      <EditOrganizationForm organization={org} currentUser={user} />
    </div>
  );
}
