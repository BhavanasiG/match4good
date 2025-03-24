/**
 * The layout for each dedicated settings page
 * and provides links to subsequent pages
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUser } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProfileForm from "./profile";
import OrganizationsForm from "./organizations";

export default async function Settings() {
  const user = await getUser(true);

  if (!user) {
    return notFound();
  }

  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col p-12 md:px-24 w-screen max-w-4xl">
        <h1 className="font-semibold text-3xl">Your Settings</h1>
        <div className="flex pt-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="organizations">Organizations</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>
                    Update your personal information and how others see you on
                    the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm user={user} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="organizations">
              <Card>
                <CardHeader>
                  <CardTitle>Organizations</CardTitle>
                  <CardDescription>Manage your organizations.</CardDescription>
                </CardHeader>
                <CardContent>
                  <OrganizationsForm user={user} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>
                    Manage your security preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>{/** Add securityform */}</CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
