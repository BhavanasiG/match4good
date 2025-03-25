"use client"; // Ensure this is a client component

import { useEffect, useState } from "react";

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
        const data = await res.json();

        console.log("Fetched charity data:", data); // Debugging

        // Ensure data is an array and limit to 5 items
        const charityList = Array.isArray(data) ? data.slice(0, 5) : [data];

        // Transform data to keep only relevant fields
        const filteredCharities: Charity[] = charityList.map((charity, index) => ({
          id: index + 1, // Generate an ID if not present
          charity_name: charity.charity_name || "Unknown",
          date_of_registration: charity.date_of_registration?.split("T")[0] || "N/A",
          removal_reason: charity.removal_reason || "N/A",
        }));

        setCharities(filteredCharities);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    fetchCharities();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Charities</h1>

      {/* Display error if fetching fails */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Show loading state */}
      {loading && <p className="text-gray-600">Loading charity data...</p>}

      {/* Display charity list */}
      {!loading && !error && charities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charities.map((charity) => (
            <div key={charity.id} className="border p-6 rounded-lg shadow-md bg-white">
              <h2 className="text-2xl font-semibold mb-2">{charity.charity_name}</h2>
              <p className="text-gray-700"><strong>Date of Registration:</strong> {charity.date_of_registration}</p>
              <p className="text-gray-700"><strong>Removal Reason:</strong> {charity.removal_reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
