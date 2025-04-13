import React from "react";
import CreateListingForm from "./form";
import { getUser } from "@/lib/prisma";
import { forbidden } from "next/navigation";

/**
 * This function shows a forbiden page if user is not logged in, otherwise,
 * it renders the CreateListingForm for the user to create a new listing.
 *
 * @returns forbidden (if user not logged in), else returns the
 * CreateListingForm page
 */
export default async function CreateOpportunityForm() {
  const user = await getUser(true);

  if (!user) {
    return forbidden();
  }

  return (
    <div>
      <b>Create Opportunity Page</b>
      <CreateListingForm user={user} />
    </div>
  );
}
