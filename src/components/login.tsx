import { auth0 } from '@/lib/auth0';
import Link from 'next/link';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

/**
 * This component has a link to the sign-up page and the log in page
 * Returns A link to the sign-up page and the log in page
 * @returns {Element} A link to the sign-up page and the log in page
 */
export function LoginButton() {
  return (
    <div className="flex space-x-2 md:space-x-4">
      <Link href="/auth/login">
        <Button className="hover:cursor-pointer">Log In</Button>
      </Link>
      <Link href="/auth/login?screen_hint=signup" className="hidden sm:block">
        <Button variant="secondary" className="hover:cursor-pointer">
          Sign Up
        </Button>
      </Link>
    </div>
  );
}

/**
 * This component is a link to the log out endpoint
 * Returns A link to the log out endpoint
 * @returns {Element} A link to the log out endpoint
 */
export function LogoutButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <Avatar className="size-8">
          <AvatarImage
            src="https://avatars.githubusercontent.com/u/83641209?v=4"
            alt="profile image"
          />
          <AvatarFallback>DM</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/user">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/auth/logout" className="text-destructive">
            Log Out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * This component is a `logoutButton` if logged in, otherwise it's a `loginButton`
 * Returns A `loginButton` or a `logoutButton`
 * @returns {Element} A `loginButton` or a `logoutButton`
 */
export default async function DynamicLoginlogoutButton() {
  const session = await auth0.getSession();

  if (session) {
    return <LogoutButton />;
  } else {
    return <LoginButton />;
  }
}
