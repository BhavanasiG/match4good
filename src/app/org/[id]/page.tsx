"use client"; // Ensure this is a client component

import { useEffect, useState } from "react";

interface Charity {
  charity_name: string;
  date_of_registration: string;
  removal_reason: string;
}

export default function OrganizationsPage() {
  const [charity, setCharity] = useState<Charity | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCharity() {
      try {
        const res = await fetch("/api/charity_api");
        if (!res.ok) {
          throw new Error(`Failed to fetch charities, Status Code: ${res.status}`);
        }
        const data = await res.json();

        console.log("Fetched charity data:", data); // Debugging

        // Extract only the needed fields
        const filteredData: Charity = {
          charity_name: data.charity_name || "Unknown",
          date_of_registration: data.date_of_registration?.split("T")[0] || "N/A",
          removal_reason: data.removal_reason || "N/A",
        };

        setCharity(filteredData);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    fetchCharity();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Charity Details</h1>

      {/* Display error if fetching fails */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Show loading state */}
      {loading && <p className="text-gray-600">Loading charity data...</p>}

      {/* Display only relevant details */}
      {!loading && !error && charity && (
        <div className="border p-6 rounded-lg shadow-md bg-white">
          <h2 className="text-2xl font-semibold mb-2">{charity.charity_name}</h2>
          <p className="text-gray-700"><strong>Date of Registration:</strong> {charity.date_of_registration}</p>
          <p className="text-gray-700"><strong>Removal Reason:</strong> {charity.removal_reason}</p>
        </div>
      )}
    </div>
  );
}
