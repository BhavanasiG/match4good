import DynamicLoginLogoutButton from "@/lib/components/login";
import { getUser } from "@/lib/prisma";
import Link from "next/link";

export default async function App() {
  const user = await getUser();

  return (
    <div>
      <p>Hello, World!</p>
      <DynamicLoginLogoutButton />

      {user && (
        <>
          <br />
          <Link href="/user">{user.username}</Link>
        </>
      )}
    </div>
  );
}
