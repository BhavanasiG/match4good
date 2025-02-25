import { getAccountType } from "@/lib/auth0";
import DynamicLoginLogoutButton from "./login";
import CreateListingButton from "./createListing";

export default async function App() {
  const account_type = await getAccountType();

  return (
    <div>
      <p>Hello, World!</p>
      <DynamicLoginLogoutButton />
      <br></br>
      {/* <p>Create Volunteering Opportunity</p> */}
      <CreateListingButton />

      {account_type && <p>{account_type}</p>}
    </div>
  );
}
