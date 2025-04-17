import Link from 'next/link';

/**
 * This component is a button that links to the page for creating a volunteering opportuntiy
 * @returns {Link} Link to the page for creating a volunteering opportunity
 */
export default function ViewListingButton() {
  return <Link href="/listing/">View Volunteering Opportunity</Link>;
}
