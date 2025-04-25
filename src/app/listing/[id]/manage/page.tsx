import prisma, { GetUser } from '@/lib/prisma';
import { forbidden, notFound } from 'next/navigation';
import { ListingManagement } from './client';
import ListingInfo from '@/components/listingInfo';

export default async function App({ params }: { params: Promise<{ id: string }> }) {
  const user = await GetUser(true);

  if (!user) {
    return forbidden();
  }

  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id: parseInt(id) },
    include: {
      applications: { include: { user: true } },
      organization: true,
    },
  });
  console.log(listing);
  if (!listing) {
    return notFound();
  }

  if (
    !user.memberOf.some((org) => org.id === listing.organizationId) &&
    !user.ownerOf.some((org) => org.id === listing.organizationId)
  ) {
    return forbidden();
  }

  return (
    <span className="grid grid-cols-2">
      <div className="">
        <ListingInfo listing={listing} />
      </div>
      <div className="">
        <ListingManagement listing={listing} />
      </div>
    </span>
  );
}
