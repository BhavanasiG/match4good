/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { NextResponse } from 'next/server';

/**
 * Handles the GET request to fetch a list of registered charities from the CharityBase API.
 * @returns {Promise<NextResponse>} JSON response containing charity data or an error message.
 */
export async function GET() {
  const API_KEY = process.env.CHARITYBASE_API_KEY;
  const URL = 'https://charitybase.uk/api/graphql';

  if (!API_KEY) {
    return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });
  }

  const query = `
    query {
      CHC {
        getCharities(filters: {}) {
          list(limit: 5) {
            id
            names {
              value
              primary
            }
            activities
            contact {
              address
              postcode
            }
            registrations {
              registrationDate
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        Authorization: `Apikey ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const {
      data,
      errors,
    }: {
      data?: { CHC?: { getCharities?: { list: Charity[] } } };
      errors?: unknown;
    } = await response.json();

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
        address: charity.contact?.address?.join(', ') || 'No address provided',
        postcode: charity.contact?.postcode || '',
        registrationDate: charity.registrations?.[0]?.registrationDate || 'Unknown',
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
 * Interface for the expected charity structure from the API.
 */
interface Charity {
  id: string;
  names: { value: string; primary: boolean }[];
  activities?: string;
  contact?: {
    address?: string[];
    postcode?: string;
  };
  registrations?: { registrationDate: string }[];
}
