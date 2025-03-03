import { auth0 } from "@/lib/auth0";

/**
 * This component has a link to the sign-up page and the log in page
 * @returns
 */
export function LoginButton() {
  return (
    <>
      <a
        href="/auth/login?screen_hint=signup"
        className="my-auto ml-4 sm:ml-8 font-medium"
      >
        Sign Up
      </a>
      <a href="/auth/login" className="my-auto ml-4 sm:ml-8 font-medium">
        Log In
      </a>
    </>
  );
}

/**
 * This component is a link to the log out endpoint
 * @returns
 */
export function LogoutButton() {
  return (
    <a href="/auth/logout" className="my-auto ml-4 sm:ml-8 font-medium">
      Log Out
    </a>
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
