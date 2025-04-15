"use client";

import React from "react";
import { useState } from "react";

/* eslint-disable @typescript-eslint/naming-convention */

/**
 * A button component that allows the user to follow or unfollow an organization.
 * @param {object} props - The component props.
 * @param {boolean} props.isFollowing - Whether the user is currently following the organization.
 * @param {number} props.organizationId - The ID of the organization to follow/unfollow.
 * @returns {React.ReactElement} The rendered button.
 */
export default function FollowButton({
  isFollowing,
  organizationId,
}: {
  isFollowing: boolean;
  organizationId: number;
}) {
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    const endpoint = following ? "/api/unfollow" : "/api/follow";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId }),
    });

    if (res.ok) {
      setFollowing(!following);
    } else {
      console.error("Failed to toggle follow");
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-2 rounded ${
        following ? "bg-gray-300 text-black" : "bg-blue-600 text-white"
      }`}
    >
      {loading ? "Loading..." : following ? "Unfollow" : "Follow"}
    </button>
  );
}
