"use client";

import { getUser } from "@/lib/prisma";
import { CreateListingData, createListing } from "./listingServer";
import React, { ChangeEvent, FormEvent, useState } from "react";

/**
 * Creates form and handles form submission for creating volunteer oppportunity by validating the input fields
 * Completes/Ensures these actions: 
 * - Ensures the name field is not empty.
 * - Checks that both start and end dates and times are provided.
 * - Validates that the end date and time is the same as or after the start date and time.
 * - Displays an appropriate error message if validation fails.
 * - Logs the form data to the console if all validations pass and passes to the server to create new record in database
 * - Listing is linked to user's organisation
 */
export default function CreateOpportunityForm() {
  // const session = auth0.getSession();
  // const user = getUser();

  // TODO: need to get user session so that we can link listing to their organisation

  const [formData, setFormData] = useState<CreateListingData>({
    name: "",
    description: "",
    startDateTime: new Date().toISOString(),
    endDateTime: new Date().toISOString(),
    // todo
    organizationId: 0,
  });

  const [errors, setErrors] = useState<String>("");
  const [success, setSuccess] = useState<String>("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors("");
    setSuccess("");

    // We want to validate the user's inputs
    if (!formData.name.trim()) {
      setErrors("Name is required");
      return;
    }

    if (!formData.startDateTime || !formData.endDateTime) {
      setErrors("Both start and end dates are required");
      return;
    }
    if (!(formData.startDateTime >= new Date().toISOString())) {
      setErrors("Start date cannot be in the past");
      return;
    }

    if (!(formData.startDateTime <= formData.endDateTime)) {
      setErrors("End date must be same as or after the start date");
      return;
    }

    // We need to call the server function to save the data to the database as
    // Next.js has distinct speration between client side and server side code
    createListing(formData);
    console.log("Form Submitted/Sent:", formData);
    setSuccess("Opportunity successfully created!");

    //By reseting the form, we help with UX
    setFormData({
      name: "",
      description: "",
      startDateTime: new Date().toISOString(),
      endDateTime: new Date().toISOString(),
      // todo
      organizationId: 0,
    });
  };

  return (
    <div>
      <b>Create Opportunity Page</b>
      <div className="Create_Opportunity_Form"></div>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="opp_name">Opportunity name:</label>
          <br />
          <input
            type="text"
            name="opp_name"
            id="opp_name"
            onChange={onChange}
            value={formData.name}
            required
          />
          <br />
        </div>

        <div>
          <label htmlFor="opp_desc">
            About this opportunity (not required):
          </label>
          <br />
          <input
            type="text"
            name="opp_description"
            id="opp_description"
            onChange={onChange}
            value={formData.description}
          />
          <br />
        </div>

        <div>
          <label htmlFor="opp_start_date">
            Opprtunity start date and time (24hr):
          </label>
          <br />
          <input
            type="datetime-local"
            name="opp_start_date"
            id="opp_start_date"
            onChange={onChange}
            value={formData.startDateTime}
            required
          />
          <br />
        </div>

        <div>
          <label htmlFor="opp_end_date">
            Opportunity end date and time (24hr):
          </label>
          <br />
          <input
            type="datetime-local"
            name="opp_end_date"
            id="opp_end_date"
            onChange={onChange}
            value={formData.endDateTime}
            required
          />
        </div>

        {errors && <p style={{ color: "red" }}>{errors}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
