import type { Metadata } from 'next';
import PrivacyPolicy from './policy';

export const metadata: Metadata = {
  title: 'Privacy Policy - Match4Good',
};

export default function App() {
  return <PrivacyPolicy />;
}
