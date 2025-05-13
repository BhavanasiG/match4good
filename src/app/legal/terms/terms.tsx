'use client';

import { siteLegal } from '@/config/siteConfig';
import Terms from './TOS.mdx';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

/**
 *
 * @returns {Element} Terms of Service page
 */
export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col max-w-5xl self-center">
      {/** Terms */}
      <section className="flex flex-col justify-between p-12 md:p-16 lg:p-24 space-y-10">
        <h2 className="text-primary text-2xl md:text-4xl text-center font-semibold">
          Terms of Service
        </h2>
        <h4 className="text-center text-muted-foreground font-medium">
          Last updated: {siteLegal.termsOfService.updated}
        </h4>
        <hr />
        <div className={`${inter.className} prose-sm prose-ul:list-disc`}>
          <Terms />
        </div>
      </section>
    </div>
  );
}
