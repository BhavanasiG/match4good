import { auth0 } from "@/lib/auth0";
import { Button } from "./ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTriggerIconless } from "./ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";

/**
 * This component has a link to the sign-up page and the log in page
 * @returns
 */
export function LoginButton() {
  return (
    <div className="flex space-x-2 md:space-x-4">
      <Link href="/auth/login">
        <Button variant={"outline"} className="cursor-pointer">Log In</Button>
      </Link>
      <Link href="/auth/login?screen_hint=signup" className="hidden sm:block">
        <Button className="cursor-pointer">Sign Up</Button>
      </Link>
    </div>
  );
}

/**
 * This component is a link to the log out endpoint
 * @returns
 */
export function LogoutButton() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTriggerIconless className="p-0 hover:bg-white">
            <Avatar className="size-8">
              <AvatarImage src="https://avatars.githubusercontent.com/u/83641209?v=4" alt="profile image"/>
              <AvatarFallback>DM</AvatarFallback>
            </Avatar>
          </NavigationMenuTriggerIconless>
          <NavigationMenuContent>
            <NavigationMenuLink href="/settings" className="font-medium">Settings</NavigationMenuLink>
            <NavigationMenuLink href="/auth/logout" className="text-destructive font-medium hover:text-destructive">Log Out</NavigationMenuLink>
          </NavigationMenuContent>  
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

/**
 * This component is a `LogoutButton` if logged in, otherwise it's a `LoginButton`
 * @returns
 */
export default async function DynamicLoginLogoutButton() {
  const session = await auth0.getSession();

  if (session) {
    return <LogoutButton />;
  } else {
    return <LoginButton />;
  }
}
