import DynamicLoginLogoutButton from "@/components/login";
import Link from "next/link";
import Image from "next/image";
import { Input } from "./ui/input";

/**
 * Creates the common header component for the site
 * @returns Header component for the site
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 grid grid-cols-3 p-3 px-6 sm:px-12 md:px-24 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex justify-start items-center">
        <Link href={"/"}>
          <Image src={"/logo_extended.svg"} alt="Match4Good Logo" width={0} height={0} className="w-auto h-7"/>
        </Link>
      </div>
      <div className="flex justify-center items-center">
        <Input type="search" placeholder="Search..." className="w-full" />
      </div>
      <div className="flex justify-end items-center">
        <DynamicLoginLogoutButton />
      </div>
    </header>
  );
}
