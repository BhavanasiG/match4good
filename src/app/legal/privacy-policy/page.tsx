'use client';

import { siteLegal } from '@/config/siteConfig';
import Policy from './privacyPolicy.mdx';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col max-w-5xl self-center">
      {/** Policy */}
      <section className="flex flex-col justify-between p-12 md:p-16 lg:p-24 space-y-10">
        <h2 className="text-primary text-2xl md:text-4xl text-center font-semibold">
          Privacy Policy
        </h2>
        <h4 className="text-center text-muted-foreground">
          Your privacy is important to us. This Privacy Policy explains how we collect, use, and
          protect your information.
        </h4>
        <h4 className="text-center text-muted-foreground font-medium">
          Last updated: {siteLegal.privacyPolicy.updated}
        </h4>
        <hr />
        <div className={`${inter.className} prose-sm prose-ul:list-disc`}>
          <Policy />
        </div>
      </section>
    </div>
  );
}
