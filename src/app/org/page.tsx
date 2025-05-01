'use client';
import { useEffect, useState } from 'react';

interface Charity {
  id: string;
  name: string;
  activities: string;
  registrationDate: string;
  address: string;
  postcode: string;
}

export default function OrgPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const res = await fetch('/api/charity_api');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();

        if (data.error) throw new Error(data.error);
        if (!data.length) throw new Error('No charities found');

        setCharities(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharities();
  }, []);

  const formatDate = (dateString: string) => {
    if (dateString === 'Unknown') return 'Unknown';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('en-GB');
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registered Charities</h1>

      {loading && <p className="text-gray-600">Loading charities...</p>}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {charities.map((charity) => (
            <div key={charity.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">{charity.name}</h2>
              <p className="text-gray-600">
                <span className="font-medium">Activities:</span> {charity.activities}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Registered:</span>{' '}
                {formatDate(charity.registrationDate)}
              </p>
              {(charity.address || charity.postcode) && (
                <p className="text-gray-600">
                  <span className="font-medium">Location:</span>{' '}
                  {[charity.address, charity.postcode].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
