"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Charity {
  id: number;
  charity_name: string;
  date_of_registration: string;
  removal_reason: string;
}

export default function CharityDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [charity, setCharity] = useState<Charity | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    void (async function fetchCharity() {
      try {
        const res = await fetch("/api/charity_api");
        if (!res.ok) {
          throw new Error(
            `Failed to fetch charities, Status Code: ${res.status}`,
          );
        }

        const data: Charity[] = (await res.json()) as Charity[]; // **Explicitly type the response**

        const charity_data = data.find((c) => c.id === Number(id));

        if (!charity_data) {
          throw new Error("Charity not found");
        }

        setCharity(charity_data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Charity Details</h1>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-gray-600">Loading charity data...</p>}

      {!loading && !error && charity && (
        <div className="border p-6 rounded-lg shadow-md bg-white">
          <h2 className="text-2xl font-semibold mb-2">
            {charity.charity_name}
          </h2>
          <p className="text-gray-700">
            <strong>Date of Registration:</strong>{" "}
            {charity.date_of_registration ?? "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>Removal Reason:</strong> {charity.removal_reason ?? "N/A"}
          </p>
        </div>
      )}
    </div>
  );
}
