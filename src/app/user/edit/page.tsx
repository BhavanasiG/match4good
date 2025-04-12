import { getUser } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import EditUserForm from "./form";

export default async function App() {
  const user = await getUser();

  if (!user) {
    return notFound();
  }

  return (
    <div>
      <h1>Hello {user.username}</h1>

      <div>
        <h2>Change your information</h2>
        <EditUserForm user={user} />
        <Link href="/user">Cancel</Link>
      </div>
    </div>
  );
}
