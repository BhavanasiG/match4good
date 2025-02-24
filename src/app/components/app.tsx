import { getAccountType } from "@/lib/auth0";
import DynamicLoginLogoutButton from "./login";
import CreateOpportunityButton from "./create_opp";

export default async function App() {
  const account_type = await getAccountType();

  return (
    <div>
      <p>Hello, World!</p>
      <DynamicLoginLogoutButton />
      <br></br>
      {/* <p>Create Volunteering Opportunity</p> */}
      <CreateOpportunityButton/>

      {account_type && <p>{account_type}</p>}
    </div>
  );
}
