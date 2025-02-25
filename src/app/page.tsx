import CreateListingButton from "@/lib/components/createListing";
import DynamicLoginLogoutButton from "@/lib/components/login";
import { getUser } from "@/lib/prisma";
import Link from "next/link";

export default async function App() {
  const user = await getUser();

  return (
    <div>
      <p>Hello, World!</p>
      <DynamicLoginLogoutButton />
      <p> Create an opportunity</p>
      <em>
        {" "}
        <CreateListingButton />{" "}
      </em>

      {user && (
        <>
          <br />
          <Link href="/user">{user.username}</Link>
        </>
      )}
    </div>
  );
}
