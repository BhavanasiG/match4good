import DynamicLoginLogoutButton from "@/components/login";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { IconMenu2 } from "@tabler/icons-react";

/**
 * Creates the common header component for the site
 * @returns {Element} Header component
 */

export default function Header() {
  return (
    <header className="sticky top-0 z-50 grid grid-cols-10 p-3 px-6 md:px-12 lg:px-24 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="col-span-3 flex justify-start sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <IconMenu2 />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href="/" className="hover:text-muted-foreground">
                Jobs
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/" className="hover:text-muted-foreground">
                Organizations
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/about-us" className="hover:text-muted-foreground">
                About
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="col-span-4 sm:col-span-3 flex justify-center sm:justify-start items-center space-x-4">
        <Link href={"/"}>
          <Image
            src={"/logo_extended.svg"}
            alt="Match4Good Logo"
            width={0}
            height={0}
            className="w-auto h-7"
          />
        </Link>
      </div>
      <div className="hidden col-span-4 sm:flex justify-center items-center space-x-2 md:space-x-4">
        <Link href="/" className="hover:text-muted-foreground">
          Jobs
        </Link>
        <Link href="/" className="hover:text-muted-foreground">
          Organizations
        </Link>
        <Link href="/about-us" className="hover:text-muted-foreground">
          About
        </Link>
      </div>
      <div className="col-span-3 flex space-x-4 justify-end items-center">
        <DynamicLoginLogoutButton />
      </div>
    </header>
  );
}
