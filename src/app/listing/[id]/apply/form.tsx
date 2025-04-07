"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import createApplication from "./actions";

/**
 * Creates form and handles form submission for creating an application
 * @param {number} param0 - listing_id: The id of the listing to which the application is being made
 * @returns {Element} - A form for creating an application for a listing
 */
export default function ApplicationForm({
  listing_id,
}: {
  listing_id: number;
}) {
  const [description, setDescription] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createApplication(listing_id, description);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setDescription(e.target.value);
  };

  return (
    <form className="bg-lime-500 object-center p-4 m-8" onSubmit={onSubmit}>
      <label htmlFor={"description"}>Comments: </label>
      <input
        className="w-sm"
        type={"textarea"}
        onChange={onChange}
        value={description}
      />
      <br />

      <button type={"submit"}>Apply now!</button>
    </form>
  );
}
