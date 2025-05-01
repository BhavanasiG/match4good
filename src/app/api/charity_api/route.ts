/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { NextResponse } from 'next/server';

/**
 * Fetches a list of registered charities from the CharityBase API.
 * @returns {Promise<NextResponse>} A response containing charity data or an error message.
 */
export async function GET() {
  const URL = 'https://charitybase.uk/api/graphql';
  const API_KEY = process.env.CHARITYBASE_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });
  }

  const query = `
    query GetCharities {
      CHC {
        getCharities(filters: {}) {
          list(limit: 10) {
            id
            names {
              value
              primary
            }
            activities
            registrations {
              registrationDate
            }
            contact {
              address
              postcode
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
    }: { data?: { CHC?: { getCharities?: { list: Charity[] } } }; errors?: unknown } =
      await response.json();

    if (errors) {
      console.error('GraphQL Errors:', errors);
      return NextResponse.json({ error: 'GraphQL Error', details: errors }, { status: 500 });
    }

    const charityList = data?.CHC?.getCharities?.list || [];

    const simplifiedData = charityList.map((charity) => ({
      id: charity.id,
      names: charity.names || [], // Ensuring required field
      activities: charity.activities || 'Not provided',
      registrations: charity.registrations || [], // Ensuring required field
      contact: charity.contact || { address: [], postcode: '' }, // Ensuring required field
      name: charity.names.find((n) => n.primary)?.value || charity.names[0]?.value || 'Unknown',
      registrationDate: charity.registrations?.[0]?.registrationDate || 'Unknown',
      address: charity.contact?.address?.join(', ') || '',
      postcode: charity.contact?.postcode || '',
    }));

    return NextResponse.json(simplifiedData);
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
  activities: string;
  registrations: { registrationDate: string }[];
  contact: { address: string[]; postcode: string };
}
