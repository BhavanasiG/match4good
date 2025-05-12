import type { Metadata } from 'next';
import ContactUsPage from './form';

export const metadata: Metadata = {
  title: 'Contact Us - Match4Good',
};

export default function App() {
  return <ContactUsPage />;
}
