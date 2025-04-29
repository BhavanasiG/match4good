import DynamicLoginLogoutButton from '@/components/login';
import Link from 'next/link';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { IconMenu2 } from '@tabler/icons-react';

/**
 * Header component for the site
 * @returns {Element} Header component
 */
export default function Header() {
  const pages = {
    explore: [
      {
        name: 'Jobs',
        href: '/listing',
        description:
          'Browse available volunteering opportunities across various sectors, causes, and locations.',
      },
      {
        name: 'Organizations',
        href: '/org',
        description:
          'Discover the nonprofits, charities, and community groups offering volunteer opportunities.',
      },
    ],
    social: [
      {
        name: 'Leaderboard',
        href: '/leaderboard',
        description:
          'Explore our top volunteering regions ranked by hours contributed, projects completed, and impact made.',
      },
      {
        name: 'Following',
        href: '/following',
        description:
          'Keep up with organizations you care about. Customize your feed to see updates from causes you follow.',
      },
      {
        name: 'News',
        href: '/news',
        description:
          'Stay informed with the latest updates, success stories, and upcoming events from our community.',
      },
    ],
    discover: [
      {
        name: 'About',
        href: '/about-us',
        description: 'Learn about our mission to connect volunteers with meaningful opportunities.',
      },
    ],
  };

  return (
    <header className="sticky top-0 z-50 grid grid-cols-10 p-3 px-6 md:px-12 lg:px-24 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="col-span-3 flex justify-start sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <IconMenu2 />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="font-semibold">Explore</DropdownMenuLabel>
            {pages.explore.map((route) => (
              <DropdownMenuItem key={route.name}>
                <Link href={route.href}>
                  <div className="p-1">
                    <h2>{route.name}</h2>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="font-semibold">Social</DropdownMenuLabel>
            {pages.social.map((route) => (
              <DropdownMenuItem key={route.name}>
                <Link href={route.href}>
                  <div className="p-1">
                    <h2>{route.name}</h2>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="font-semibold">Discover</DropdownMenuLabel>
            {pages.discover.map((route) => (
              <DropdownMenuItem key={route.name}>
                <Link href={route.href}>
                  <div className="p-1">
                    <h2>{route.name}</h2>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="col-span-4 sm:col-span-3 flex justify-center sm:justify-start items-center space-x-4">
        <Link href={'/'}>
          <Image
            src={'/logo_extended.svg'}
            alt="Match4Good Logo"
            width={0}
            height={0}
            className="w-auto h-7"
          />
        </Link>
      </div>
      <div className="hidden col-span-4 sm:flex justify-center items-center space-x-2 md:space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">Explore</DropdownMenuTrigger>
          <DropdownMenuContent>
            {pages.explore.map((route) => (
              <DropdownMenuItem key={route.name} asChild>
                <Link href={route.href}>
                  <div className="p-1 w-96">
                    <h2 className="font-medium">{route.name}</h2>
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {route.description}
                    </p>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">Social</DropdownMenuTrigger>
          <DropdownMenuContent>
            {pages.social.map((route) => (
              <DropdownMenuItem key={route.name} asChild>
                <Link href={route.href}>
                  <div className="p-1 w-96">
                    <h2 className="font-medium">{route.name}</h2>
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {route.description}
                    </p>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">Discover</DropdownMenuTrigger>
          <DropdownMenuContent>
            {pages.discover.map((route) => (
              <DropdownMenuItem key={route.name} asChild>
                <Link href={route.href}>
                  <div className="p-1 w-96">
                    <h2 className="font-medium">{route.name}</h2>
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {route.description}
                    </p>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="col-span-3 flex space-x-4 justify-end items-center">
        <DynamicLoginLogoutButton />
      </div>
    </header>
  );
}

/*
      <div className="hidden col-span-4 sm:flex justify-center items-center space-x-2 md:space-x-4">
        {pages.map((route) => (
          <Link href={route.href} className="hover:text-muted-foreground">
            {route.name}
          </Link>
        ))}
      </div>
      */
