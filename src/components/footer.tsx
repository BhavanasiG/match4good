import Image from 'next/image';
import Link from 'next/link';
import { Separator } from './ui/separator';

/**
 * The function creates the footer to be used on the website
 * @returns {Element} Common footer for webpages
 */
export default function Footer() {
  return (
    <footer className="p-12 px-6 md:px-16 lg:px-24 border-t">
      <div className="grid grid-cols-1 sm:grid-cols-3 items-center text-center space-y-8 sm:space-y-0">
        <div className="flex justify-center items-center">
          <Link href={'/'}>
            <Image
              alt="Match4Good Logo"
              src={'/logo_extended.svg'}
              className="my-auto w-full h-8 md:h-11"
              width={0}
              height={0}
            />
          </Link>
        </div>
        <div className="flex justify-center items-center">
          <div className="flex flex-col space-y-2">
            <h2 className="font-semibold text-2xl">Company</h2>
            <Link href={'/org'} className="hover:text-muted-foreground">
              Organizations
            </Link>
            <Link href={''} className="hover:text-muted-foreground">
              Jobs
            </Link>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="flex flex-col space-y-2">
            <h2 className="font-semibold text-2xl">Resources</h2>
            <Link href={'/help/about'} className="hover:text-muted-foreground">
              About Us
            </Link>
            <Link href={'/help/contact-us'} className="hover:text-muted-foreground">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
      <Separator className="my-8" />
      <div className="grid grid-cols-2 items-center text-sm text-muted-foreground">
        <p className="flex justify-start"> © 2025 Match4Good </p>
        <div className="flex justify-end space-x-4">
          <Link href={'/legal/terms'} className="flex justify-center">
            <p>Terms and Conditions</p>
          </Link>
          <Link href={'/legal/privacy-policy'} className="flex justify-center">
            <p>Privacy Policy</p>
          </Link>
        </div>
      </div>
    </footer>
  );
}
