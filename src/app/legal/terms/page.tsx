import type { Metadata } from 'next';
import TermsOfService from './terms';

export const metadata: Metadata = {
  title: 'Terms of Service - Match4Good',
};

export default function App() {
  return <TermsOfService />;
}
