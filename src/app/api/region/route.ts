/* eslint-disable @typescript-eslint/naming-convention */
// Currently we don't use this, but we might in the future
// If we want a region from a client-side request, we can use this
// API route to get the region from a postcode

import { NextRequest, NextResponse } from 'next/server';

type ErrorApiResponse = {
  error: string;
  details?: string;
};

type RegionApiResponse = {
  postcode: string;
  city: string | null;
  county: string | null;
  statisticalRegion: string | null;
};

type PostcodeIOResponse = {
  status: number;
  result: {
    postcode: string;
    quality: number;
    eastings: number;
    northings: number;
    country: string;
    nhs_ha: string;
    longitude: number;
    latitude: number;
    european_electoral_region: string;
    primary_care_trust: string;
    region: string | null; // e.g., "South East"
    lsoa: string;
    msoa: string;
    incode: string;
    outcode: string;
    parliamentary_constituency: string;
    admin_district: string | null; // e.g., "Guildford"
    parish: string | null; // e.g., "Worplesdon"
    admin_county: string | null; // e.g., "Surrey"
    admin_ward: string;
    ced: string | null;
    ccg: string;
    nuts: string;
    codes: {
      admin_district: string;
      admin_county: string;
      admin_ward: string;
      parish: string;
      parliamentary_constituency: string;
      ccg: string;
      ccg_id: string;
      ced: string;
      nuts: string;
      lsoa: string;
      msoa: string;
    };
  } | null;
  error?: string;
};

/**
 * Handles API requests to fetch region information based on a given postcode.
 * This function processes incoming HTTP requests, validates the request body,
 * and fetches region data from the Postcodes.io API. It returns the region
 * information or an appropriate error response.
 * @param {NextRequest} req - The incoming HTTP request object from Next.js.
 * @returns {Promise<NextResponse>} A JSON response containing either the region data or an error message.
 * ## Request Method
 * - Supports `POST` requests.
 * ## Request Body
 * - `postcode` (string): The postcode for which region information is requested.
 * ## Response
 * - On success (`200`): Returns a `RegionApiResponse` object containing:
 *   - `postcode` (string): The requested postcode.
 *   - `city` (string | null): The city or borough (admin district).
 *   - `county` (string | null): The county (admin county).
 *   - `statisticalRegion` (string | null): The broader statistical region.
 * ## External API
 * - Fetches data from the Postcodes.io API: `https://api.postcodes.io/postcodes/{postcode}`
 * ## Error Handling
 * - Logs errors to the console for debugging purposes.
 * - Returns appropriate HTTP status codes and error messages for different failure scenarios.
 */
export default async function handler(req: NextRequest) {
  if (req.method === 'POST') {
    const postcode: PostcodeIOResponse = (await req.json()) as PostcodeIOResponse;

    if (!postcode || typeof postcode !== 'string') {
      return NextResponse.json({ error: 'Postcode is required' } as ErrorApiResponse, {
        status: 400,
      });
    }

    try {
      const postcodeIoUrl = `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`;
      const response = await fetch(postcodeIoUrl);

      if (!response.ok) {
        if (response.status === 404) {
          return NextResponse.json(
            { error: 'Invalid postcode or postcode not found' } as ErrorApiResponse,
            { status: 404 },
          );
        }
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data: PostcodeIOResponse = (await response.json()) as PostcodeIOResponse;

      if (data.status === 200 && data.result) {
        // Choose which fields you want for your "region"
        const regionData: RegionApiResponse = {
          postcode: data.result.postcode,
          city: data.result.admin_district, // Often the city/borough
          county: data.result.admin_county,
          statisticalRegion: data.result.region, // Broader region
          // We might want to add some logic here if a field is null
          // For example, some London postcodes might have null for admin_county
          // but admin_district will be the London Borough.
        };
        return NextResponse.json(regionData, { status: 200 });
      } else {
        return NextResponse.json(
          { error: data.error || 'Postcode not found or invalid response' } as ErrorApiResponse,
          { status: 404 },
        );
      }
    } catch (error: unknown) {
      console.error('Error fetching postcode data:', error);
      let errorMessage = 'An unexpected error occurred.';
      let errorDetails: string | undefined;

      if (error instanceof Error) {
        errorMessage = 'Internal server error';
        errorDetails = error.message; // Safely access .message
      }
      return NextResponse.json({ error: errorMessage, details: errorDetails } as ErrorApiResponse, {
        status: 500,
      });
    }
  }
}
