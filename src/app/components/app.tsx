import { getAccountType } from "@/lib/auth0";
import DynamicLoginLogoutButton from "./login";

export default async function App() {
  const account_type = await getAccountType();

  return (
    <div>
      <p>Hello, World!</p>
      <DynamicLoginLogoutButton />

      {account_type && <p>{account_type}</p>}
    </div>
  );
}
