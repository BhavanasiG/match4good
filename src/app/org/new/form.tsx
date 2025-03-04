"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { createOrg, CreateOrgFormData } from "./actions";

export default function CreateOrgForm() {
  const [form_data, setFormData] = useState<CreateOrgFormData>({
    name: "",
    description: undefined,
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

    const error = await createOrg(form_data);
    setError(error);
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form_data.name}
          onChange={onChange}
        />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <input
          id="description"
          name="description"
          type="textarea"
          value={form_data.description}
          onChange={onChange}
        />
      </div>

      {error && <p className={"text-red-600"}>{error}</p>}

      <button type="submit">Submit</button>
    </form>
  );
}
