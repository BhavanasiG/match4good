/* eslint-disable @typescript-eslint/naming-convention */
import prisma from '@/lib/prisma';

type Region = {
  id: number;
  name: string;
  points: number;
};

// Response type for Postcodes.io API
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
 * Fetches the region associated with a given postcode using the Postcodes.io API.
 * @param {string} postcode - The postcode to look up
 * @returns {Promise<Region | null>} - Returns a Promise that resolves to a Region object or null if not found
 * @throws {Error} - Throws an error if the API request fails or if the response is invalid
 */
export default async function getRegionFromPostcode(postcode: string): Promise<Region | null> {
  if (!postcode) {
    return null; // Cannot get region for empty postcode
  }

  try {
    // Call the external Postcodes.io API directly
    const postcodeIoUrl = `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`;
    const response = await fetch(postcodeIoUrl);

    if (!response.ok) {
      console.error(
        `Error fetching data from Postcodes.io for postcode "${postcode}": ${response.status} ${response.statusText}`,
      );
      // If 404, it's likely an invalid postcode
      if (response.status === 404) {
        console.warn(`Postcode "${postcode}" not found by Postcodes.io.`);
      }
      // Could try handling specific Postcodes.io errors if necessary (e.g., invalid postcode returns 404), in the future
      // For now, just log the error and return null
      return null;
    }

    const data: PostcodeIOResponse = (await response.json()) as PostcodeIOResponse;

    if (data.status !== 200 || !data.result) {
      console.error(`Postcodes.io returned status ${data.status} for postcode "${postcode}"`);
      return null;
    }

    // --- Process the Postcodes.io response to determine the region name ---
    // Postcodes.io provides various administrative regions.

    let regionName: string | null = null;

    // For postcodes in England, we use the 'region' field (e.g., "South East")
    if (data.result.country === 'England') {
      regionName = data.result.region; // This should match one of our English seeded regions
    } else {
      // For Scotland, Wales, Northern Ireland, we use the 'country' field as the region name
      regionName = data.result.country; // This should match our "Scotland", "Wales", "Northern Ireland" seeded regions
    }

    if (!regionName) {
      console.warn(
        `Could not determine a region name from Postcodes.io data for postcode "${postcode}".`,
      );
      return null;
    }

    // --- Query your internal Region table by name ---
    // We will for now use the 'region' field from Postcodes.io as the region name.
    // This corresponds to an official region name from the government.
    const region = await prisma.region.findUnique({
      where: {
        name: regionName,
      },
    });

    // If a matching region is found in our database, return the region
    if (region) {
      return region as Region;
    } else {
      console.warn(
        `Region "${regionName}" found from postcode "${postcode}" does not exist in your database.`,
      );
      return null;
    }
  } catch (error: unknown) {
    console.error(`An error occurred while processing postcode "${postcode}":`, error);

    if (error instanceof Error) {
      console.error('Error details:', error.message); // Safely access .message
    }

    return null;
  }
}
