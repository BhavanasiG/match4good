import { User } from '@/lib/prisma';

export type Props = { user: User };

/**
 * Displays basic user information such as username, owned organizations,
 * and orgs the user is a member of.
 * @param {Props} user accepts a prisma user object to display
 * @returns {Element} - Returns a component that displays the user information
 */
export function UserInfo({ user }: Props) {
  return (
    <div>
      <h1>{user.username}</h1>

      <div>
        {user.ownerOf.length > 0 && (
          <div>
            <h2>Owned Organizations: </h2>
            <ul>
              {user.ownerOf.map((o) => (
                <li key={o.id}>
                  <h3>{o.name}</h3>
                  <p>{o.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {user.memberOf.length > 0 && (
          <div>
            <h2>Organizations: </h2>
            <ul>
              {user.memberOf.map((o) => (
                <li key={o.id}>
                  <h3>{o.name}</h3>
                  <p>{o.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
