"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Charity {
  id: number;
  charity_name: string;
  date_of_registration: string;
  removal_reason: string;
}

export default function OrganizationsPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCharities() {
      try {
        const res = await fetch("/api/charity_api");
        if (!res.ok) {
          throw new Error(`Failed to fetch charities, Status Code: ${res.status}`);
        }
        const data: Charity[] = await res.json();
        setCharities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchCharities();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Charities</h1>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-gray-600">Loading charity data...</p>}

      {!loading && !error && charities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charities.map((charity) => (
            <Link key={charity.id} href={`/org/${charity.id}`} passHref>
              <div className="border p-6 rounded-lg shadow-md bg-white hover:bg-gray-100 cursor-pointer">
                <h2 className="text-2xl font-semibold mb-2">{charity.charity_name}</h2>
                <p className="text-gray-700">
                  <strong>Date of Registration:</strong> {charity.date_of_registration || "N/A"}
                </p>
                <p className="text-gray-700">
                  <strong>Removal Reason:</strong> {charity.removal_reason || "N/A"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
