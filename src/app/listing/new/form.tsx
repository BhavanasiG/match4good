"use client";

import { User } from "@/lib/prisma";
import { ChangeEvent, FormEvent, useState } from "react";
import { createListing, CreateListingData } from "./actions";

export interface CreateListingFormProps {
  user: User;
}

export default function CreateListingForm({ user }: CreateListingFormProps) {
  const userOrgs = [...new Set([...user.owner_of, ...user.member_of])];

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [formData, setFormData] = useState<CreateListingData>({
    name: "",
    description: "",
    startDateTime: new Date().toISOString(),
    endDateTime: new Date().toISOString(),
    organizationId: userOrgs.length == 0 ? 0 : userOrgs[0].id,
  });

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((prevData) => ({
      ...prevData,
      // Ensure organizationId is a number
      [name]: name === "organizationId" ? Number(value) : value,
    }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const startDateTime = new Date(formData.startDateTime);
    const endDateTime = new Date(formData.endDateTime);
    const now = new Date();

    // We need to validate the user's inputs
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.startDateTime || !formData.endDateTime) {
      setError("Both start and end dates are required");
      return;
    }
    if (startDateTime < now) {
      setError("Start date cannot be in the past");
      return;
    }

    if (startDateTime > endDateTime) {
      setError("End date must be same as or after the start date");
      return;
    }

    if (!userOrgs.some((org) => org.id === formData.organizationId)) {
      setError("Invalid organization selected.");
      return;
    }

    const status = await createListing(formData);
    setError(status);
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

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
