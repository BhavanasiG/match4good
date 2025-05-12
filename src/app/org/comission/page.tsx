import type { Metadata } from 'next';
import CharityList from './charity';

export const metadata: Metadata = {
  title: `Charity Comission - Match4Good`,
};

export default function App() {
  return <CharityList />;
}
