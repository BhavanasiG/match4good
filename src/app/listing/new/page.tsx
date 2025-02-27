import React from "react";
import CreateListingForm from "./form";
import { getUser } from "@/lib/prisma";
import { forbidden } from "next/navigation";

/**
 * Creates form and handles form submission for creating volunteer oppportunity
 * by validating the input fields
 *
 * Completes/Ensures these actions:
 * - Ensures the name field is not empty.
 * - Checks that both start and end dates and times are provided.
 * - Validates that the end date and time is the same as or
 * after the start date and time.
 * - Displays an appropriate error message if validation fails.
 * - Logs the form data to the console if all validations pass
 * and passes to the server to create new record in database
 * - Listing is linked to one of the user's organisation
 *
 * @todo set failed user authentication to `return forbidden()`
 * once Next.JS implementation forbidden is no longer experimental.
 * Currently prints `You are not authorized to create listings.` on page
 *
 * @todo Makes use of React useEffect, so we need to implement
 * a site wide common loading component, to use here.
 * It currently returns `<p>Loading...</p>` while loading.
 *
 * @todo We need to implement site wide page to show errors relating to
 * loading pages, currently returns
 * `<p>You are not authorized to create listings.</p>`, if user not permitted to
 *  create a listing
 *
 * @see [Functions: forbidden | Next.js]
 * (https://nextjs.org/docs/app/api-reference/functions/forbidden)
 */
export default async function CreateOpportunityForm() {
  // We need to use React useState and useEffect as we need call and obtain data
  //  whilst allowing the page to load

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
