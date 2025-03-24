import DynamicLoginLogoutButton from "@/components/login";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTriggerIconless } from "./ui/navigation-menu";

/**
 * Creates the common header component for the site
 * @returns Header component for the site
 */
export default function Header() {

  return (
    <header className="sticky top-0 z-50 grid grid-cols-3 p-3 px-6 md:px-12 lg:px-24 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex justify-start sm:hidden">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTriggerIconless className="p-2">
                <Menu strokeWidth={1.8} />
              </NavigationMenuTriggerIconless>
              <NavigationMenuContent>
                <NavigationMenuLink href="/">Jobs</NavigationMenuLink>
                <NavigationMenuLink href="/">Organizations</NavigationMenuLink>
                <NavigationMenuLink href="/about-us">About</NavigationMenuLink>
              </NavigationMenuContent>  
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex justify-middle sm:justify-start items-center space-x-4">
        <Link href={"/"}>
          <Image src={"/logo_extended.svg"} alt="Match4Good Logo" width={0} height={0} className="w-auto h-7"/>
        </Link>
      </div>
      <div className="hidden sm:flex justify-center items-center space-x-2 md:space-x-4">
        <Link href="/">Jobs</Link>
        <Link href="/">Organizations</Link>
        <Link href="/about-us">About</Link>
      </div>
      <div className="flex space-x-4 justify-end items-center">
        <DynamicLoginLogoutButton />
      </div>
    </header>
  );
}
