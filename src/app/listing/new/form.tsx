"use client";

import { User } from "@/lib/prisma";
import { ChangeEvent, FormEvent, useState } from "react";
import { createListing, CreateListingData } from "./actions";

export interface CreateListingFormProps {
  user: User;
}

/**
 * Creates form and handles form submission for creating a volunteer opportunity
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
 * @param {User} param0 The user (object) for which a new listing form will be
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
    organization_id: user_orgs.length === 0 ? 0 : user_orgs[0].id,
  });

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev_data) => ({
      ...prev_data,
      [name]: name === "organization_id" ? Number(value) : value,
    }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const start_datetime = new Date(form_data.start_datetime);
    const end_datetime = new Date(form_data.end_datetime);
    const now = new Date();

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
      setError("End date must be the same as or after the start date");
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
    <form onSubmit={onSubmit} className="space-y-4 max-w-lg mx-auto">
      <div>
        <label htmlFor="name" className="block font-medium">
          Opportunity Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={form_data.name}
          onChange={onChange}
          required
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <label htmlFor="description" className="block font-medium">
          Description (Optional)
        </label>
        <input
          type="text"
          name="description"
          id="description"
          value={form_data.description}
          onChange={onChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <label htmlFor="start_datetime" className="block font-medium">
          Start Date & Time
        </label>
        <input
          type="datetime-local"
          name="start_datetime"
          id="start_datetime"
          value={form_data.start_datetime}
          onChange={onChange}
          required
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <label htmlFor="end_datetime" className="block font-medium">
          End Date & Time
        </label>
        <input
          type="datetime-local"
          name="end_datetime"
          id="end_datetime"
          value={form_data.end_datetime}
          onChange={onChange}
          required
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <label htmlFor="organization_id" className="block font-medium">
          Select Organization
        </label>
        <select
          name="organization_id"
          id="organization_id"
          value={form_data.organization_id}
          onChange={onChange}
          required
          className="border p-2 w-full rounded"
        >
          <option value="" disabled>
            -- Select an organization --
          </option>
          {user_orgs.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <button
        type="submit"
        className="bg-blue-500 text-white p-2 w-full rounded"
      >
        Submit
      </button>
    </form>
  );
}
