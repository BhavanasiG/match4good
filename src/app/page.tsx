import CreateListingButton from "@/components/createListing";
import DynamicLoginLogoutButton from "@/components/login";

export default async function App() {
  return (
    <div>
      <p>Hello, World!</p>
      <DynamicLoginLogoutButton />
      <br />
      <CreateListingButton />
    </div>
  );
}
