import DynamicLoginLogoutButton from "@/lib/components/login";
import { getUser } from "@/lib/prisma";

export default async function App() {
  const user = await getUser();

  return (
    <div>
      <p>Hello, World!</p>
      <DynamicLoginLogoutButton />

      {user && <p>{user.username}</p>}
    </div>
  );
}
