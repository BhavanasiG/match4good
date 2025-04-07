import Link from "next/link";
/**
 * 
 * @returns {Link} Link to the page for creating a new organization
 * This component is a button that links to the page for creating a new organization
 */
export default function CreateOrgButton() {
  return <Link href="/org/new">Create Organization</Link>;
}
