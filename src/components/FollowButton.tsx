'use client';

import React from 'react';
import { useState } from 'react';
import { Button } from './ui/button';
import { IconMinus, IconPlus } from '@tabler/icons-react';

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

    const endpoint = following ? '/api/unfollow' : '/api/follow';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organizationId }),
    });

    if (res.ok) {
      setFollowing(!following);
    } else {
      console.error('Failed to toggle follow');
    }

    setLoading(false);
  };

  return (
    <Button onClick={handleClick} disabled={loading} className="cursor-pointer">
      {loading ? (
        'Loading...'
      ) : following ? (
        <>
          Unfollow
          <IconMinus />
        </>
      ) : (
        <>
          Follow
          <IconPlus />
        </>
      )}
    </Button>
  );
}
