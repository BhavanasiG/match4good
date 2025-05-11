'use client';
import { OrganizationWithSelectedRelations, User } from '@/lib/prisma';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Trash2 as RemoveIcon } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

import {
  UpdateOrganization,
  AddMemberToOrganization,
  RemoveMemberFromOrganization,
} from './submit';
import { Textarea } from '@/components/ui/textarea';

const organizationFormSchema = z.object({
  name: z.string().min(4).max(32),
  description: z.string().max(400).optional(),
  address: z.string().min(4).max(64),
  postcode: z
    .string()
    .min(6)
    .max(8)
    .trim()
    .regex(/^([A-Z][A-HJ-Y]?\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/, {
      message: 'Invalid postcode format',
    }),
});

const addMemberFormSchema = z.object({
  memberIdentifier: z.string().min(1, { message: 'Please enter a username.' }),
});

/**
 *
 * @param {OrganizationWithSelectedRelations} param0 - organization: The organization object to display
 * @returns {Element} - Returns a form for updating the organization's information
 */
export default function EditOrganizationForm({
  organization,
  currentUser,
}: {
  organization: OrganizationWithSelectedRelations;
  currentUser: User;
}) {
  /* eslint-disable @typescript-eslint/naming-convention */

  const router = useRouter();

  const updateForm = useForm<z.infer<typeof organizationFormSchema>>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: organization.name,
      description: organization.description || '',
      address: organization.address || '',
      postcode: organization.postcode || '',
    },
  });

  /**
   * Handles the form submission
   * @param {z.infer<typeof updateForm>} values - The values from the form
   */
  async function OnSubmitUpdate(values: z.infer<typeof organizationFormSchema>) {
    const toastId = toast.loading('Saving organization changes...');

    try {
      const result = await UpdateOrganization(
        organization.id,
        values.name,
        values.description || null,
        values.address,
        values.postcode,
      );

      if (result.success) {
        toast.success(result.message, { id: toastId });
        router.refresh(); // Refresh page/data on success
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch (error: unknown) {
      console.error('Failed to update organization:', error);
      if (error instanceof Error) {
        toast.error(error.message, { id: toastId });
      } else {
        toast.error('An unexpected error occurred.', { id: toastId });
      }
    }
  }

  const addMemberForm = useForm<z.infer<typeof addMemberFormSchema>>({
    resolver: zodResolver(addMemberFormSchema),
    defaultValues: {
      memberIdentifier: '',
    },
  });

  /**
   * Handles the add member form submission.
   * @param {z.infer<typeof addMemberFormSchema>} values - The values from the add member form.
   */
  async function OnSubmitAddMember(values: z.infer<typeof addMemberFormSchema>) {
    const toastId = toast.loading(`Adding member ${values.memberIdentifier}...`);

    try {
      const result = await AddMemberToOrganization(organization.id, values.memberIdentifier);

      if (result.success) {
        toast.success(result.message, { id: toastId });
        addMemberForm.reset();
        router.refresh(); // Refresh page/data on success
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch (error: unknown) {
      console.error('Failed to add member:', error);
      if (error instanceof Error) {
        toast.error(error.message, { id: toastId });
      } else {
        toast.error('An unexpected error occurred.', { id: toastId });
      }
    }
  }

  /**
   * Handles the removal of a member from the organization.
   * @param {number} memberId - The ID of the member to be removed.
   * @param {string} memberName - The name of the member to be removed.
   */
  async function handleRemoveMember(memberId: number, memberName: string) {
    const toastId = toast.loading(`Removing ${memberName}...`);

    try {
      const result = await RemoveMemberFromOrganization(organization.id, memberId);

      if (result.success) {
        toast.success(result.message, { id: toastId });
        router.refresh(); // Refresh page/data on success
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch (error: unknown) {
      console.error('Failed to remove member:', error);
      if (error instanceof Error) {
        toast.error(error.message, { id: toastId });
      } else {
        toast.error('An unexpected error occurred.', { id: toastId });
      }
    }
  }

  return (
    <div className="self-center p-12 md:p-24 w-screen max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Organization Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...updateForm}>
            <form onSubmit={updateForm.handleSubmit(OnSubmitUpdate)} className="space-y-8">
              <FormField
                control={updateForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input placeholder={organization.name} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={updateForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder={organization.description || undefined} {...field} />
                    </FormControl>
                    <FormDescription>Tell us about your organization.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={updateForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder={organization.address || undefined} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={updateForm.control}
                name="postcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postcode</FormLabel>
                    <FormControl>
                      <Input placeholder={organization.postcode || undefined} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="hover:cursor-pointer">
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator className="my-12" />

      {/* --- Member Management Section --- */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Manage Members</h2>

        {/* Display Current Members */}
        <Card>
          <CardHeader>
            {/* Add +1 to count for the owner */}
            <CardTitle>
              Current Members ({organization.members.length + (organization.owner ? 1 : 0)})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Display Owner First*/}
            {organization.owner && (
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={organization.owner.profilePictureUrl || undefined}
                    alt={`${organization.owner.username || 'Owner'}'s avatar`}
                  />
                  {/* Fallback to first letter of username/email */}
                  <AvatarFallback>
                    {organization.owner.username?.[0] || organization.owner.email?.[0] || 'O'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {organization.owner.username ||
                      organization.owner.email ||
                      `Owner ID: ${organization.owner.userId}`}
                  </p>
                  <p className="text-sm text-gray-500">Owner</p>
                </div>
                {/* No remove button for the owner */}
              </div>
            )}
            {/* Display Members (exclude owner if they were included in the members array) */}
            {organization.members
              .filter((member) => member.id !== organization.owner.id) // Filter out owner if included in members list
              .map((member) => (
                <div key={member.id} className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      {/* Correct AvatarImage usage with src prop */}
                      <AvatarImage
                        src={member.profilePictureUrl || undefined}
                        alt={`${member.username || 'Member'}'s avatar`}
                      />
                      {/* Fallback to first letter of username/email */}
                      <AvatarFallback>
                        {member.username?.[0] || member.email?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {member.username || member.email || `User ID: ${member.userId}`}
                      </p>
                      <p className="text-sm text-gray-500">Member</p>
                    </div>
                  </div>
                  {/* Only show remove button if current user is the owner AND the member is not the owner */}
                  {currentUser.id === organization.owner.id &&
                    member.id !== organization.owner.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleRemoveMember(
                            member.id,
                            member.username || member.email || `User ${member.id}`,
                          )
                        } // Pass member ID and name to handler
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        aria-label={`Remove ${member.username || member.email || `User ${member.id}`}`}
                      >
                        <RemoveIcon className="h-4 w-4" /> {/* Use Lucide icon */}
                      </Button>
                    )}
                </div>
              ))}

            {/* Message if no members (excluding owner) */}
            {organization.members.filter((member) => member.id !== organization.owner.id).length ===
              0 && <p className="text-gray-500 text-center mt-4">No members added yet.</p>}
          </CardContent>
        </Card>

        {/* Form to Add New Member */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Member</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...addMemberForm}>
              <form onSubmit={addMemberForm.handleSubmit(OnSubmitAddMember)} className="space-y-4">
                <FormField
                  control={addMemberForm.control}
                  name="memberIdentifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter username" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the username of the user you want to add as a member.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="hover:cursor-pointer">
                  Add Member
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
