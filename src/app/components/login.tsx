import { auth0 } from "@/lib/auth0";

/**
 * This component has a link to the sign-up page and the log in page
 * @returns
 */
export async function LoginButton() {
  return (
    <>
      <a href="/auth/login?screen_hint=signup">Sign Up</a>
      <a href="/auth/login">Log In</a>
    </>
  );
}

/**
 * This component is a link to the log out endpoint
 * @returns
 */
export async function LogoutButton() {
  return <a href="/auth/logout">Log Out</a>;
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
