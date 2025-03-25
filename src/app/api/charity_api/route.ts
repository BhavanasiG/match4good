import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Fetching charity data...");

    const apiKey = process.env.CHARITY_API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing. Check .env.local");
    }

    const registeredNumber = "1042119";
    const suffix = "0";
    const url = `https://api.charitycommission.gov.uk/register/api/allcharitydetailsV2/${registeredNumber}/${suffix}`;

    console.log("API URL:", url);

    const res = await fetch(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch charities, Status Code:", res.status);
      throw new Error(`API request failed with status ${res.status}`);
    }

    const data = await res.json();
    console.log("API Response:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in API route:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
