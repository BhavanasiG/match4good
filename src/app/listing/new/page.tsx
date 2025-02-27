"use client";

import authenticateUserForListingCreation, {
  findUserOrganizations,
} from "./auth";
import { CreateListingData, createListing } from "./actions";
import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";

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
export default function CreateOpportunityForm() {
  // We need to use React useState and useEffect as we need call and obtain data
  //  whilst allowing the page to load

  const [userAuthenticated, setUserAuthenticated] = useState<boolean | null>(
    null
  );
  const [userOrgs, setUserOrgs] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [errors, setErrors] = useState<String>("");
  const [success, setSuccess] = useState<String>("");

  const [formData, setFormData] = useState<CreateListingData>({
    name: "",
    description: "",
    startDateTime: new Date().toISOString(),
    endDateTime: new Date().toISOString(),
    organizationId: 0,
  });

  // We need to use useEffect as these actions need to be completed fully before
  // being used
  // useEffect allows for doing this and allowing the rest of the page to load
  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const isAuthenticated = await authenticateUserForListingCreation();
      setUserAuthenticated(isAuthenticated);

      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      const organizations = await findUserOrganizations();
      setUserOrgs(organizations || []);

      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!userAuthenticated)
    return <p>You are not authorized to create listings.</p>;

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      // Ensure organizationId is a number
      [name]: name === "organizationId" ? Number(value) : value,
    }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors("");
    setSuccess("");
    setSubmissionStatus("");

    const startDateTime = new Date(formData.startDateTime);
    const endDateTime = new Date(formData.endDateTime);
    const now = new Date();

    // We need to validate the user's inputs
    if (!formData.name.trim()) {
      setErrors("Name is required");
      return;
    }

    if (!formData.startDateTime || !formData.endDateTime) {
      setErrors("Both start and end dates are required");
      return;
    }
    if (startDateTime < now) {
      setErrors("Start date cannot be in the past");
      return;
    }

    if (startDateTime > endDateTime) {
      setErrors("End date must be same as or after the start date");
      return;
    }

    if (!userOrgs.some((org) => org.id === formData.organizationId)) {
      setErrors("Invalid organization selected.");
      return;
    }

    // We need to call the server function to save the data to the database as
    // Next.js has distinct speration between client side and server side code
    //This also allows us to validate on the server side as well
    console.log("Form Submitted/Sent:", formData);

    const status = await createListing(formData);
    setSubmissionStatus(status);

    if (status != "Valid Data") {
      setErrors(submissionStatus);
      return;
    }
    setSuccess("Opportunity successfully created!");

    //By reseting the form, we help with UX
    setFormData({
      name: "",
      description: "",
      startDateTime: new Date().toISOString(),
      endDateTime: new Date().toISOString(),
      organizationId: 0,
    });
  };

  return (
    <div>
      <b>Create Opportunity Page</b>
      <div className="Create_Opportunity_Form">
        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="name">Opportunity name:</label>
            <br />
            <input
              type="text"
              name="name"
              id="name"
              onChange={onChange}
              value={formData.name}
              required
            />
            <br />
          </div>

          <div>
            <label htmlFor="description">
              About this opportunity (not required):
            </label>
            <br />
            <input
              type="text"
              name="description"
              id="description"
              onChange={onChange}
              value={formData.description}
            />
            <br />
          </div>

          <div>
            <label htmlFor="startDateTime">
              Opprtunity start date and time (24hr):
            </label>
            <br />
            <input
              type="datetime-local"
              name="startDateTime"
              id="startDateTime"
              onChange={onChange}
              value={formData.startDateTime}
              required
            />
            <br />
          </div>

          <div>
            <label htmlFor="endDateTime">
              Opportunity end date and time (24hr):
            </label>
            <br />
            <input
              type="datetime-local"
              name="endDateTime"
              id="endDateTime"
              onChange={onChange}
              value={formData.endDateTime}
              required
            />
          </div>

          <div>
            <label htmlFor="organisationId">
              Select Organisation opportunity should be listed for:
            </label>
            <br />
            <select
              name="organizationId"
              id="organizationId"
              onChange={onChange}
              value={formData.organizationId}
              required
            >
              <option value="" disabled>
                --Select an organization--
              </option>
              {userOrgs.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          {errors && <p style={{ color: "red" }}>{errors}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
