import { getUser } from "@/lib/prisma";
import Form from "./form";

export default async function App() {
  const user = await getUser();

  if (!user) {
    // todo: redirect
    return;
  }

  return (
    <div>
      <h1>Hello {user.username}</h1>

      <div>
        <h2>Change your information</h2>
        <Form user={user} />
      </div>
    </div>
  );
}
