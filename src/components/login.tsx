import { auth0 } from '@/lib/auth0';
import Link from 'next/link';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { CommonAvatar } from '@/app/settings/profileImageUpload';
import { IconPlus } from '@tabler/icons-react';
import prisma, { GetUser } from '@/lib/prisma';

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
export async function LogoutButton() {
  const user = await GetUser();
  const orgs = await prisma.organization.findMany({
    where: {
      ownerId: user?.id,
    },
  });

  const hasOrgs: boolean = orgs.length > 0;

  return (
    <div className="space-x-3 sm:space-x-5 flex">
      <div className="hidden sm:flex">
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer" asChild>
            <Button size={'sm'}>
              Create
              <IconPlus />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {hasOrgs && (
              <DropdownMenuItem asChild>
                <Link href="/listing/new" className="cursor-pointer">
                  <div>
                    <h2>Jobs</h2>
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      Create a new job listing
                    </p>
                  </div>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href="/org/new" className="cursor-pointer">
                <div>
                  <h2>Organization</h2>
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    Create a new charity organization
                  </p>
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer" asChild>
            <Button size={'sm'}>
              <IconPlus />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {hasOrgs && (
              <DropdownMenuItem asChild>
                <Link href="/listing/new" className="cursor-pointer">
                  <div>
                    <h2>Jobs</h2>
                  </div>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href="/org/new" className="cursor-pointer">
                <div>
                  <h2>Organization</h2>
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer">
          <CommonAvatar className="size-8" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/user">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/auth/logout" className="text-destructive">
              Log Out
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
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
