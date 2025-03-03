import { getUser } from "@/lib/prisma";
import { forbidden } from "next/navigation";
import CreateOrgForm from "./form";

export default async function App() {
  const user = await getUser(true);

  if (!user) {
    return forbidden();
  }

  return <CreateOrgForm />;
}
