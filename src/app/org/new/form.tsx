"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { createOrg, CreateOrgFormData } from "./actions";

/**
 * @returns {Element} - A form for creating a new organization
 * This component is a form that allows the user to create a new organization
 */
export default function CreateOrgForm() {
  const [form_data, setFormData] = useState<CreateOrgFormData>({
    name: "",
    description: undefined,
    address: "",
    postcode: "",
  });
  const [error, setError] = useState<string | undefined>(undefined);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev_data) => ({
      ...prev_data,
      [name]: value,
    }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (form_data.name.trim() === "") {
      setError("Name cannot be empty");
      return;
    }
    if (form_data.address.trim() === "") {
      setError("Address cannot be empty");
      return;
    }
    if (form_data.postcode.trim() === "") {
      setError("Postcode cannot be empty");
      return;
    }

    const error = await createOrg(form_data);
    setError(error);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form_data.name}
          onChange={onChange}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <input
          id="description"
          name="description"
          type="text"
          value={form_data.description}
          onChange={onChange}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label htmlFor="address">Address</label>
        <input
          id="address"
          name="address"
          type="text"
          required
          value={form_data.address}
          onChange={onChange}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label htmlFor="postcode">Postcode</label>
        <input
          id="postcode"
          name="postcode"
          type="text"
          required
          value={form_data.postcode}
          onChange={onChange}
          className="border p-2 w-full"
        />
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Submit
      </button>
    </form>
  );
}
