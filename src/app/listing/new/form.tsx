"use client";

import { User } from "@/lib/prisma";
import { ChangeEvent, FormEvent, useState } from "react";
import { createListing, CreateListingData } from "./actions";

export interface CreateListingFormProps {
  user: User;
}

/**
 * Creates form and handles form submission for creating volunteer oppportunity
 * by validating the input fields
 *
 * Completes/Ensures these **client-side** actions:
 * - Ensures the name field is not empty.
 * - Checks that both start and end dates and times are provided.
 * - Validates that the end date and time is the same as or
 * after the start date and time.
 * - Displays an appropriate error message if validation fails.
 * - Logs the form data to the console if all validations pass
 * and passes to the server to create new record in database
 * - Listing is linked to one of the user's organisation
 * @param {CreateListingFormProps} param0 The user (object) for which a new listing form will be
 * generated
 * @returns {Element} - A form for creating a new listing
 */
export default function CreateListingForm({ user }: CreateListingFormProps) {
  const user_orgs = [...new Set([...user.owner_of, ...user.member_of])];

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [form_data, setFormData] = useState<CreateListingData>({
    name: "",
    description: "",
    start_datetime: new Date().toISOString(),
    end_datetime: new Date().toISOString(),
    organization_id: user_orgs.length == 0 ? 0 : user_orgs[0].id,
  });

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((prev_data) => ({
      ...prev_data,
      // Ensure organizationId is a number
      [name]: name === "organizationId" ? Number(value) : value,
    }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const start_datetime = new Date(form_data.start_datetime);
    const end_datetime = new Date(form_data.end_datetime);
    const now = new Date();

    // We need to validate the user's inputs
    if (!form_data.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!form_data.start_datetime || !form_data.end_datetime) {
      setError("Both start and end dates are required");
      return;
    }
    if (start_datetime < now) {
      setError("Start date cannot be in the past");
      return;
    }

    if (start_datetime > end_datetime) {
      setError("End date must be same as or after the start date");
      return;
    }

    if (!user_orgs.some((org) => org.id === form_data.organization_id)) {
      setError("Invalid organization selected.");
      return;
    }

    const error = await createListing(form_data);
    setError(error);
  };

  return (
    <div className="create-listing-form">
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="name">Opportunity name:</label>
          <br />
          <input
            type="text"
            name="name"
            id="name"
            onChange={onChange}
            value={form_data.name}
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
            value={form_data.description}
          />
          <br />
        </div>

        <div>
          <label htmlFor="start_datetime">
            Opprtunity start date and time (24hr):
          </label>
          <br />
          <input
            type="datetime-local"
            name="start_datetime"
            id="start_datetime"
            onChange={onChange}
            value={form_data.start_datetime}
            required
          />
          <br />
        </div>

        <div>
          <label htmlFor="end_datetime">
            Opportunity end date and time (24hr):
          </label>
          <br />
          <input
            type="datetime-local"
            name="end_datetime"
            id="end_datetime"
            onChange={onChange}
            value={form_data.end_datetime}
            required
          />
        </div>

        <div>
          <label htmlFor="organisation_id">
            Select Organisation opportunity should be listed for:
          </label>
          <br />
          <select
            name="organisation_id"
            id="organisation_id"
            onChange={onChange}
            value={form_data.organization_id}
            required
          >
            <option value="" disabled>
              --Select an organization--
            </option>
            {user_orgs.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        {error && <p className={"text-red-600"}>{error}</p>}
        {success && <p className={"text-red-600"}>{success}</p>}

        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
