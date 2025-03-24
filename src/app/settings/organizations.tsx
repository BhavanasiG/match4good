/**
 * Displays organizations the user owns and is a part of
 * @param Props accepts a prisma user object to display
 * @returns OrganizationsForm component JSX
 */

import { User } from "@/lib/prisma";

export type Props = { user: User };

export default function OrganizationsForm({ user }: Props) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col">
        <h3 className="text-lg font-medium">Owned organizations</h3>
        {user.owner_of.length > 0 ? (
          <div className="flex flex-col space-y-4">
            {user.owner_of.map((o) => (
              <div key={o.id} className="rounded-md border px-4 py-2">
                <p className="font-medium">{o.name}</p>
                <p className="text-sm">{o.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            You do not own any organizations
          </p>
        )}
      </div>
      <div className="flex flex-col">
        <h3 className="text-lg font-medium">Joined organizations</h3>
        {user.member_of.length > 0 ? (
          <div className="flex flex-col space-y-4">
            {user.member_of.map((o) => (
              <div key={o.id} className="rounded-md border px-4 py-2">
                <p className="font-medium">{o.name}</p>
                <p className="text-sm">{o.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            You have not joined any organizations
          </p>
        )}
      </div>
    </div>
  );
}
