import CreateListingButton from '@/components/createListing';
import CreateOrgButton from '@/components/creatOrg';
import DynamicLoginLogoutButton from '@/components/login';
import ViewListingButton from '@/components/viewListing';

export default function App() {
  return (
    <div>
      <p>Hello, World!</p>
      <DynamicLoginLogoutButton />
      <br />
      <CreateListingButton />
      <br />
      <ViewListingButton />
      <br />
      <CreateOrgButton />
    </div>
  );
}
