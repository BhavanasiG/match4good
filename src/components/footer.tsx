import Image from "next/image";
import Link from "next/link";
import { Separator } from "./ui/separator";

/**
 * The function creates the footer to be used on the website
 * @returns {Element} Common footer for webpages
 */
export default function Footer() {
  return (
    <footer className="p-12 px-6 md:px-16 lg:px-24 border-t bg-secondary text-secondary-foreground">
      <div className="grid grid-cols-1 sm:grid-cols-3 items-center text-center space-y-8 sm:space-y-0">
        <div className="flex justify-center items-center">
          <Link href={"/"}>
            <Image
              alt="Match4Good Logo"
              src={"/logo_extended.svg"}
              className="my-auto w-full h-8 md:h-11"
              width={0}
              height={0}
            />
          </Link>
          <p className="flex pt-2 mx-auto">
            <span className="hidden sm:block">Copyright&nbsp;</span>©
            Match4Good 2025
          </p>
        </div>
        <div className="flex justify-center items-center">
          <div className="flex flex-col space-y-2">
            <h2 className="font-semibold text-2xl">Company</h2>
            <Link href={"/org"} className="hover:text-white">
              Organizations
            </Link>
            <Link href={""} className="hover:text-white">
              Jobs
            </Link>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="flex flex-col space-y-2">
            <h2 className="font-semibold text-2xl t">Resources</h2>
            <Link href={"/about-us"} className="hover:text-white">
              About Us
            </Link>
            <Link href={"/contact-us"} className="hover:text-white">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
      <Separator className="my-8 bg-muted-foreground" />
      <div className="grid grid-cols-2 items-center text-sm text-muted-foreground">
        <p className="flex justify-start"> © 2025 Match4Good </p>
        <div className="flex justify-end space-x-4">
          <Link href={"/"} className="flex justify-center">
            <p>Terms and Conditions</p>
          </Link>
          <Link href={"/privacy-policy"} className="flex justify-center">
            <p>Privacy Policy</p>
          </Link>
        </div>
      </div>
    </footer>
  );
}
