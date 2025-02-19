import { User } from "@/lib/prisma";
import { notFound } from "next/navigation";

export type Props = { user: User | null };

export default async function App({ user }: Props) {
  if (!user) {
    return notFound();
  }

  return (
    <div>
      <h1>{user.username}</h1>

      <div>
        {user.owner_of.length > 0 && (
          <div>
            <h2>Owned Organizations: </h2>
            <ul>
              {user.owner_of.map((o) => (
                <li key={o.id}>
                  <h3>{o.name}</h3>
                  <p>{o.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {user.member_of.length > 0 && (
          <div>
            <h2>Organizations: </h2>
            <ul>
              {user.member_of.map((o) => (
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
