/**
 * The layout for each dedicated settings page
 * and provides links to subsequent pages
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GetUser } from '@/lib/prisma';
import { forbidden } from 'next/navigation';
import ProfileForm from './profile';
import OrganizationsForm from './organizations';
import AppearanceForm from './appearance';
import SecurityForm from './security';
import ProfileImageUpload from './profileImageUpload';

export default async function Settings() {
  const user = await GetUser(true);

  if (!user) {
    return forbidden();
  }

  return (
    <div className="self-center flex justify-center p-12 md:p-24 w-screen max-w-8xl">
      <div className="flex flex-col md:p-12 lg:px-24 w-screen max-w-4xl">
        <h1 className="font-semibold text-3xl">Your Settings</h1>
        <div className="flex pt-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 grid-rows-2 h-20 md:h-auto md:grid-cols-4 md:grid-rows-none">
              <TabsTrigger value="profile" className="cursor-pointer">
                Profile
              </TabsTrigger>
              <TabsTrigger value="organizations" className="cursor-pointer">
                Organizations
              </TabsTrigger>
              <TabsTrigger value="security" className="cursor-pointer">
                Security
              </TabsTrigger>
              <TabsTrigger value="appearance" className="cursor-pointer">
                Appearance
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>
                    Update your personal information and how others see you on the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileImageUpload />
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
                  <CardDescription>Manage your security preferences.</CardDescription>
                </CardHeader>
                <CardContent>
                  <SecurityForm />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Manage your appearance preferences.</CardDescription>
                </CardHeader>
                <CardContent>
                  <AppearanceForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
