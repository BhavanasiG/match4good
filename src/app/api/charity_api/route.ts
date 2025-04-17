import { NextResponse } from 'next/server';

interface CharityData {
  id: number;
  charityName: string;
  dateOfRegistration: string;
  removalReason: string;
}

/**
 * This API route fetches charity data from the Charity Commission API
 * and returns it as a JSON response.
 * @returns {Promise<NextResponse>} - JSON response containing charity data
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export async function GET(): Promise<NextResponse> {
  try {
    console.log('Fetching charity data...');

    const apiKey = process.env.CHARITY_API_KEY;
    if (!apiKey) {
      throw new Error('API Key is missing. Check .env.local');
    }

    const registeredNumbers = ['1000000', '1000001', '1000002', '1000003', '1000004'];
    const charityData: CharityData[] = [];

    for (const [index, registeredNumber] of registeredNumbers.entries()) {
      const suffix = '0';
      const url = `https://api.charitycommission.gov.uk/register/api/allcharitydetailsV2/${registeredNumber}/${suffix}`;

      console.log('Fetching charity:', url);

      const res = await fetch(url, {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Ocp-Apim-Subscription-Key': apiKey,
        },
      });

      if (!res.ok) {
        console.error(`Failed to fetch charity ${registeredNumber}, Status:`, res.status);
        continue;
      }
      const data: Partial<CharityData> = (await res.json()) as Partial<CharityData>;
      charityData.push({
        id: index + 1,
        charityName: data.charityName ?? 'Unknown',
        dateOfRegistration: data.dateOfRegistration ?? 'N/A',
        removalReason: data.removalReason ?? 'N/A',
      });
    }

    console.log('Fetched Charities:', charityData);
    return NextResponse.json(charityData);
  } catch (err) {
    console.error('Error in API route:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
