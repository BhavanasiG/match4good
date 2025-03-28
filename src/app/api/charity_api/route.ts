import { NextResponse } from "next/server";

interface CharityData {
  id: number;
  charity_name: string;
  date_of_registration: string;
  removal_reason: string;
}

export async function GET() {
  try {
    console.log("Fetching charity data...");

    const apiKey = process.env.CHARITY_API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing. Check .env.local");
    }

    const registeredNumbers = ["1000000", "1000001", "1000002", "1000003", "1000004"];
    const charityData: CharityData[] = [];

    for (const [index, registeredNumber] of registeredNumbers.entries()) {
      const suffix = "0";
      const url = `https://api.charitycommission.gov.uk/register/api/allcharitydetailsV2/${registeredNumber}/${suffix}`;

      console.log("Fetching charity:", url);

      const res = await fetch(url, {
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
        },
      });

      if (!res.ok) {
        console.error(`Failed to fetch charity ${registeredNumber}, Status:`, res.status);
        continue;
      }

      const data = await res.json();
      charityData.push({
        id: index + 1,
        charity_name: data.charity_name || "Unknown",
        date_of_registration: data.date_of_registration || "N/A",
        removal_reason: data.removal_reason || "N/A",
      });
    }

    console.log("Fetched Charities:", charityData);
    return NextResponse.json(charityData);
  } catch (err) {
    console.error("Error in API route:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
