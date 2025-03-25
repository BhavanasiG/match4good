import Link from "next/link";

/**
 * This component is a button that links to the page for creating a volunteering opportuntiy
 * @returns
 */
export default function CreateListingButton() {
  return <Link href="/listing/new">Create Volunteering Opportunity</Link>;
}
