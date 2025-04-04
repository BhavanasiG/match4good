import { NextResponse } from "next/server";

interface CharityData {
  id: number;
  charity_name: string;
  date_of_registration: string;
  removal_reason: string;
}
// eslint-disable-next-line @typescript-eslint/naming-convention
export async function GET() {
  try {
    console.log("Fetching charity data...");

    const api_key = process.env.CHARITY_API_KEY;
    if (!api_key) {
      throw new Error("API Key is missing. Check .env.local");
    }

    const registered_numbers = ["1000000", "1000001", "1000002", "1000003", "1000004"];
    const charity_data: CharityData[] = [];

    for (const [index, registered_number] of registered_numbers.entries()) {
      const suffix = "0";
      const url = `https://api.charitycommission.gov.uk/register/api/allcharitydetailsV2/${registered_number}/${suffix}`;

      console.log("Fetching charity:", url);

      const res = await fetch(url, {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          "Ocp-Apim-Subscription-Key": api_key,
        },
      });

      if (!res.ok) {
        console.error(`Failed to fetch charity ${registered_number}, Status:`, res.status);
        continue;
      }
      const data: Partial<CharityData> = (await res.json()) as Partial<CharityData>;
      charity_data.push({
        id: index + 1,
        charity_name: data.charity_name ?? "Unknown",
        date_of_registration: data.date_of_registration ?? "N/A",
        removal_reason: data.removal_reason ?? "N/A",
      });
    }

    console.log("Fetched Charities:", charity_data);
    return NextResponse.json(charity_data);
  } catch (err) {
    console.error("Error in API route:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
