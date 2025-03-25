import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Fetching charity data...");

    const apiKey = process.env.CHARITY_API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing. Check .env.local");
    }

    // Example charity numbers (Replace with real ones)
    const registeredNumbers = ["1000000", "1000001", "1000002", "1000003", "1000004"];

    const charityData = [];

    for (const registeredNumber of registeredNumbers) {
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
        continue; // Skip this charity and continue with others
      }

      const data = await res.json();
      charityData.push(data); // Store the charity data
    }

    console.log("Fetched Charities:", charityData);

    // Ensure only relevant details are returned
    const processedData = charityData.slice(0, 5).map((charity) => ({
      charity_name: charity.charity_name || "Unknown",
      date_of_registration: charity.date_of_registration || "N/A",
      removal_reason: charity.removal_reason || "N/A",
    }));

    return NextResponse.json(processedData);
  } catch (error) {
    console.error("Error in API route:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
