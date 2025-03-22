import { auth0 } from "@/lib/auth0";
import { Button } from "./ui/button";
import { Settings } from "lucide-react";
import Link from "next/link";

/**
 * This component has a link to the sign-up page and the log in page
 * @returns
 */
export function LoginButton() {
  return (
    <div className="flex space-x-4">
      <Link href="/auth/login">
        <Button variant={"outline"} className="cursor-pointer">Log In</Button>
      </Link>
      <Link href="/auth/login?screen_hint=signup">
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
    <div className="flex space-x-4 items-center">
      <Link href="/auth/logout">
        <Button variant={"outline"} className="cursor-pointer">Log Out</Button>
      </Link>
      <Link href="/settings">
        <Button variant={"outline"} size={"icon"} className="cursor-pointer">
          <Settings className="size-6" strokeWidth={1.8} />
        </Button>
      </Link>
    </div>
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
