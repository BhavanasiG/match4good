import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      include: { organization: true },
    });

    return NextResponse.json(listings);
  } catch {
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}
