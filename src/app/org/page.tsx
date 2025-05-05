'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Charity {
  id: string;
  name: string;
  activities: string;
  address: string;
  postcode: string;
  registrationDate: string;
  url: string;
}

export default function CharityList() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const res = await fetch('/api/charity_api');
        const data = await res.json();
        if (Array.isArray(data)) {
          setCharities(data.slice(0, 5));
        } else {
          setError('Failed to load charities.');
        }
      } catch (e) {
        setError('Something went wrong.');
      }
    };

    fetchCharities();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Top 5 Charities</h2>
      {charities.map((charity) => (
        <Link
          key={charity.id}
          href={charity.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 border rounded-lg hover:bg-gray-50 transition"
        >
          <h3 className="text-lg font-semibold">{charity.name}</h3>
          <p>{charity.activities}</p>
          <p className="text-sm text-gray-600">{charity.address}</p>
        </Link>
      ))}
    </div>
  );
}
