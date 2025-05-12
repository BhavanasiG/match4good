'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconMapPin, IconSearch } from '@tabler/icons-react';

interface Charity {
  id: string;
  name: string;
  activities: string;
  region: string;
  url: string;
}

const validCities = [
  'Newcastle',
  'Manchester',
  'Liverpool',
  'Leeds',
  'Sheffield',
  'Nottingham',
  'Birmingham',
  'Coventry',
  'Cambridge',
  'Norwich',
  'London',
  'Brighton',
  'Southampton',
  'Bristol',
  'Plymouth',
  'Cardiff',
];

/**
 *
 * @returns {Element} Charity page
 */
export default function CharityList() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState('all');

  const fetchCharities = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams(region !== 'all' ? { region } : {});
      console.log('Query URL:', `/api/charity_api?${queryParams.toString()}`); // Debugging

      const res = await fetch(`/api/charity_api?${queryParams}`);
      const data = (await res.json()) as Charity[];

      if (Array.isArray(data)) {
        setCharities(data);
      } else {
        setError('Failed to load charities.');
      }
    } catch (err: unknown) {
      let errorMessage = 'Something went wrong';

      if (typeof err === 'string') errorMessage = err;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCharities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/** Banner */}
      <section className="flex flex-col">
        <div className="flex items-center h-50 overflow-hidden relative">
          <Image
            src={'/org-background.jpg'}
            alt="Banner Image"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="flex flex-col bg-primary justify-center text-center items-center p-8 space-y-2">
          <h2 className="text-3xl font-semibold text-primary-foreground">Charity Comission</h2>
          <h3 className="text-xl text-primary-foreground">
            Explore top charities from around the UK
          </h3>
        </div>
      </section>
      {/**  listings */}
      <section className="flex flex-col p-12 md:px-24 xl:px-40">
        {/* Filters Section - Positioned Directly Above Listings */}
        <div className="flex justify-end mb-8 space-x-5">
          <Select
            value={region}
            defaultValue="all"
            onValueChange={(value: string) => setRegion(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {validCities.map((obj, index) => (
                <SelectItem key={index} value={obj}>
                  {obj}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={(e) => {
              e.preventDefault();
              void fetchCharities();
            }}
            className="cursor-pointer"
          >
            Apply filter
            <IconSearch />
          </Button>
        </div>
        <div className="grid grid-rows-4 sm:grid-rows-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:grid-rows-none gap-10">
          {loading && <p className="text-center self-center">Loading...</p>}
          {error && (
            <p className="text-center self-center text-destructive">An error occured: {error} </p>
          )}
          {!loading && !error && (
            <>
              {charities.map((charity, index) => (
                <CharityComponent key={index} charity={charity} />
              ))}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

/**
 *
 * @param {Charity} charity Charity object
 * @returns {Element} Charity component card
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
function CharityComponent({ charity }: { charity: Charity }) {
  return (
    <Link href={charity.url} className="w-full">
      <Card className="hover:shadow-lg hover:shadow-gray-300 transition-shadow duration-100 ease-in-out h-full flex flex-col justify-between">
        <CardHeader>
          <CardTitle>
            <p className="text-lg">{charity.name}</p>
          </CardTitle>
          <CardDescription className="flex space-x-2">
            <IconMapPin size={20} />
            <p>{charity.region}</p>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-base line-clamp-3">{charity.activities}</CardContent>
      </Card>
    </Link>
  );
}
