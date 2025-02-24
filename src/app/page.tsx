<<<<<<< HEAD
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
=======
import App from "./components/app";

export default async function Home() {
  return <App />;
>>>>>>> 997e2c4e342fa74fba2d8f44966b4d363d6beb0d
}
