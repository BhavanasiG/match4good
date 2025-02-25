"use server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export interface CreateListingData {
  name: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  organizationId: number;
}

export async function createListing(form_data: CreateListingData) {
  // TODO add server side validation
  
  // check creator is part of org and all fields are valid
  // This requires being able to get user session!
  const listing = await prisma.listing.create({
    data: {
      ...form_data,
    },
  });

  return redirect(`/listing/${listing.id}`);
}
