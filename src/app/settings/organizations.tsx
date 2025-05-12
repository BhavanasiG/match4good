'use client';

import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DialogClose } from '@/components/ui/dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { User } from '@/lib/prisma';
import Link from 'next/link';
import { DeleteOrganization } from './submit';

/**
 * @typedef {object} Props - Component props for OrganizationsForm.
 * @property {User} user - The Prisma User object with 'ownerOf' and 'memberOf' relations included.
 */
export type Props = { user: User };

/**
 * Client component displaying the organizations the authenticated user owns and is a member of.
 * Provides options to view organizations and delete owned ones.
 * @param {Props} props - Component props.
 * @param {User} props.user - The user object containing their owned and joined organizations.
 * @returns {Element} A component displaying the user's organization memberships.
 */
export default function OrganizationsForm({ user }: Props) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col">
        <h3 className="text-lg font-medium">Owned organizations</h3>
        {user.ownerOf.length > 0 ? (
          <div className="flex flex-col space-y-4">
            {user.ownerOf.map((o) => (
              <Card className="rounded-md border" key={o.id}>
                <CardHeader>
                  <CardTitle>{o.name}</CardTitle>
                  <p className="text-sm">{o.description}</p>
                </CardHeader>
                <CardFooter className="flex flex-row gap-2">
                  <Button size={'sm'}>
                    <Link href={`/org/${o.id}`}>View</Link>
                  </Button>
                  <Dialog>
                    <DialogTrigger
                      className=" hover:cursor-pointer 
                    bg-destructive hover:bg-destructive/60 text-white shadow-xs focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60
                    h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5
                    inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive
                    "
                    >
                      Delete Organization
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete your
                          organization &quot;{o.name}&quot;.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="destructive"
                          className="hover:cursor-pointer"
                          onClick={() => DeleteOrganization(o.id)}
                        >
                          Delete
                        </Button>
                        <DialogClose
                          className="ml-2 hover:cursor-pointer
                        border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50
                        h-9 px-4 py-2 has-[>svg]:px-3
                        inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive
                        "
                        >
                          Cancel
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">You do not own any organizations</p>
        )}
      </div>
      <div className="flex flex-col">
        <h3 className="text-lg font-medium">Joined organizations</h3>
        {user.memberOf.length > 0 ? (
          <div className="flex flex-col space-y-4">
            {user.memberOf.map((o) => (
              <Card className="rounded-md border" key={o.id}>
                <CardHeader>
                  <CardTitle>{o.name}</CardTitle>
                  <p className="text-sm">{o.description}</p>
                </CardHeader>
                <CardFooter className="flex flex-row gap-2">
                  <Button size={'sm'}>
                    <Link href={`/org/${o.id}`}>View</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">You have not joined any organizations</p>
        )}
      </div>
    </div>
  );
}
