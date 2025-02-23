import User from "@/lib/components/user";
import { getUser } from "@/lib/prisma";
import Link from "next/link";

export default async function App() {
  const user = await getUser(true);

  return (
    <>
      <p>Welcome to your profile!</p>
      <Link href="/user/edit">Edit your information</Link>
      <User user={user} />
    </>
  );
}
