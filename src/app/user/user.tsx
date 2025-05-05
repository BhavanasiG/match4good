import { User } from '@/lib/prisma';

/**
 * Displays basic user information such as username, owned organizations,
 * and orgs the user is a member of.
 * @param {User} user accepts a prisma user object to display
 * @returns {Element} - Returns a component that displays the user information
 */
export function UserInfo({ user }: { user: User }) {
  return (
    <div className="space-y-10">
      {/* User Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{user.username}</h1>
        <p className="text-muted-foreground text-sm">User ID: {user.id}</p>
      </div>

      {/* Owned Organizations */}
      {user.ownerOf.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Owned Organizations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {user.ownerOf.map((org) => (
              <div
                key={org.id}
                className="bg-card border border-border rounded-lg p-6 shadow-sm space-y-2"
              >
                <h3 className="text-lg font-semibold">{org.name}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {org.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Member Of Organizations */}
      {user.memberOf.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Organizations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {user.memberOf.map((org) => (
              <div
                key={org.id}
                className="bg-muted/30 border border-border rounded-lg p-6 shadow-sm space-y-2"
              >
                <h3 className="text-lg font-semibold">{org.name}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {org.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
