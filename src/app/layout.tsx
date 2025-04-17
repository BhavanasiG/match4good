import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';
import CookieBanner from '@/components/CookieBanner';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Match4Good - Find volunteering opportunities near you!',
  description: 'Find volunteering opportunities near you!',
};

/**
 * @param {*} root0 - The root layout for the app
 * @param {*} root0.children - The children of the root layout
 * @returns {Element} - The root layout for the app
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${inter.className} antialiased flex flex-col min-h-screen bg-linear-to-b from-secondary/10 to-30% to-background`}
      >
        <ThemeProvider attribute={'class'}>
          <CookieBanner />
          <Header />
          <main className="grow flex flex-col min-h-screen">{children}</main>
          <Toaster position="top-center" richColors closeButton />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
