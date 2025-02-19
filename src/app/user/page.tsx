import User from "@/lib/components/user";
import { getUser } from "@/lib/prisma";

export default async function App() {
  const user = await getUser(true);

  return <User user={user} />;
}
