import CreateListingButton from "@/components/createListing";
import DynamicLoginLogoutButton from "@/components/login";
import ViewListingButton from "@/components/viewListing";

export default async function App() {
  return (
    <div>
      <p>Hello, World!</p>
      <DynamicLoginLogoutButton />
      <br />
      <CreateListingButton />
      <br />
      <ViewListingButton />
    </div>
  );
}
