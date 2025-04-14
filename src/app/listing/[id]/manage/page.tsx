import prisma, { getUser } from "@/lib/prisma";
import { forbidden, notFound } from "next/navigation";
import {
  CloseApplications,
  ListingWithApplications,
  PresentApplication,
} from "./client";
import ListingInfo from "@/components/listingInfo";
import { ListingStatus } from "@/../generated/prisma_client";

function Applicants({ listing }: { listing: ListingWithApplications }) {
  return (
    <div>
      <h2>Pending Applications</h2>
      <ul>
        {listing.applications.map((application, i) => (
          <li key={i}>
            <PresentApplication application={application} />
          </li>
        ))}
      </ul>

      {listing.status === ListingStatus.AcceptingApplications && (
        <CloseApplications listing={listing} />
      )}
    </div>
  );
}

export default async function App({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getUser(true);

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
    !user.member_of.some((org) => org.id === listing.organization_id) &&
    !user.owner_of.some((org) => org.id === listing.organization_id)
  ) {
    return forbidden();
  }

  return (
    <span className="grid grid-cols-2">
      <div className="">
        <ListingInfo listing={listing} />
      </div>
      <div className="">
        <Applicants listing={listing} />
      </div>
    </span>
  );
}
