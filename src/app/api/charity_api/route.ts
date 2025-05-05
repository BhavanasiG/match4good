/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prefer-const */
/* eslint-disable jsdoc/require-jsdoc */

import { NextResponse } from 'next/server';

const API_KEY = process.env.CHARITYBASE_API_KEY;
const URL = 'https://charitybase.uk/api/graphql';

// Mapping common city names to their corresponding GeoRegion codes
const cityToRegionMap: Record<string, string> = {
  Newcastle: 'E12000001',
  Manchester: 'E12000002',
  Liverpool: 'E12000002',
  Leeds: 'E12000003',
  Sheffield: 'E12000003',
  Nottingham: 'E12000004',
  Birmingham: 'E12000005',
  Coventry: 'E12000005',
  Cambridge: 'E12000006',
  Norwich: 'E12000006',
  London: 'E12000007',
  Brighton: 'E12000008',
  Southampton: 'E12000008',
  Bristol: 'E12000009',
  Plymouth: 'E12000009',
  Cardiff: 'W99999999',
};

export async function GET(request: Request) {
  if (!API_KEY) {
    return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });
  }

  const searchParams = new URLSearchParams(request.url.split('?')[1] || '');
  const regionFilter = searchParams.get('region') || '';

  // Convert city name to GeoRegion code if applicable
  const mappedRegion = cityToRegionMap[regionFilter] || regionFilter;

  let filters: any = {};
  if (mappedRegion) filters.geo = { region: mappedRegion };

  console.log('Filters being sent:', filters); // Debugging

  const query = regionFilter
    ? `query GetCharities($filters: FilterCHCInput!) {
        CHC {
          getCharities(filters: $filters) {
            list(limit: 5) {
              id
              names { value primary }
              activities
              geo { region }
            }
          }
        }
      }`
    : `query {
        CHC {
          getCharities(filters: {}) {
            list(limit: 5) {
              id
              names { value primary }
              activities
            }
          }
        }
      }`;

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        Authorization: `Apikey ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(regionFilter ? { query, variables: { filters } } : { query }),
    });

    const {
      data,
      errors,
    }: { data?: { CHC?: { getCharities?: { list: Charity[] } } }; errors?: unknown } =
      await response.json();

    console.log('API Response:', data?.CHC?.getCharities?.list); // Debugging

    if (errors) {
      console.error('GraphQL Errors:', errors);
      return NextResponse.json({ error: 'GraphQL Error', details: errors }, { status: 500 });
    }

    const charities = data?.CHC?.getCharities?.list || [];

    const simplified = charities.map((charity: Charity) => {
      const nameObj = charity.names.find((n) => n.primary) || charity.names[0];
      return {
        id: charity.id,
        name: nameObj?.value || 'Unnamed Charity',
        activities: charity.activities || 'No description available',
        region: charity.geo?.region || 'Unknown Region',
        url: `https://search.charitybase.uk/charities/${charity.id}`,
      };
    });

    return NextResponse.json(simplified);
  } catch (error) {
    console.error('Fetch Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch charity data' },
      { status: 500 },
    );
  }
}

/**
 * Defines the structure of charity objects received from the API.
 */
interface Charity {
  id: string;
  names: { value: string; primary: boolean }[];
  activities?: string;
  geo?: { region: string };
}
