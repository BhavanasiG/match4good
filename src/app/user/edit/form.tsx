'use client';

import type React from 'react';
import { useState } from 'react';
import updateUser from './submit';
import { User } from '@/lib/prisma';

/**
 *
 * @param {User} param0 - Accepts a user object
 * @returns {Element} - Returns a form for editing the user
 */
export default function EditUserForm({ user }: { user: User }) {
  const [username, setUsername] = useState(user.username);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles the form submission for updating the user's username.
   * @param {React.FormEvent} e - The form submission event.
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      await updateUser({ username });
      setSuccess('Profile updated!');
    } catch {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card p-6 rounded-xl shadow flex flex-col gap-4 max-w-md mx-auto"
      autoComplete="off"
    >
      <label htmlFor="username" className="font-semibold text-[#388e3c]">
        Username
      </label>
      <input
        type="text"
        name="username"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
        autoFocus
        required
      />

      {success && <div className="text-green-600 text-sm">{success}</div>}
      {error && <div className="text-red-500 text-sm">{error}</div>}

      <button
        type="submit"
        className="mt-4 bg-gradient-to-r from-[#4CAF50] to-[#81C784] text-white font-semibold py-2 rounded-lg shadow hover:from-[#388e3c] hover:to-[#66bb6a] transition"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
