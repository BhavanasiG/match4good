"use client";

import { User } from "@/../generated/prisma_client";
import { useState } from "react";
import updateUser from "./submit";

export type Props = {
  user: User;
};

/**
 *
 * @param {User} param0 - Accepts a user object
 * @returns {Element} - Returns a form for editing the user
 */
export default function EditUserForm({ user }: Props) {
  const [username, setUsername] = useState(user.username);

  return (
    <div>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <button type="submit" onClick={() => updateUser({ username })}>
        Save
      </button>
    </div>
  );
}
