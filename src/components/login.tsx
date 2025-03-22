import { auth0 } from "@/lib/auth0";
import { Button } from "./ui/button";
import Link from "next/link";

/**
 * This component has a link to the sign-up page and the log in page
 * @returns
 */
export function LoginButton() {
  return (
    <div className="flex space-x-4">
      <Link href="/auth/login">
        <Button variant={"outline"}>Log In</Button>
      </Link>
      <Link href="/auth/login?screen_hint=signup">
        <Button>Sign Up</Button>
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
    <Link href="/auth/logout" className="cursor-pointer">
      <Button variant={"outline"}>Log Out</Button>
    </Link>
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
