'use client';
import { Organization } from '@/lib/prisma';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
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
import { UpdateOrganization, AddMemberToOrganization } from './submit';

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
 * @param {Organization} param0 - organization: The organization object to display
 * @returns {Element} - Returns a form for updating the organization's information
 */
export default function EditOrganizationForm({ organization }: { organization: Organization }) {
  /* eslint-disable @typescript-eslint/naming-convention */
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
  function OnSubmitUpdate(values: z.infer<typeof organizationFormSchema>) {
    let error = false;

    UpdateOrganization(
      organization.id,
      values.name,
      values.description || null,
      values.address,
      values.postcode,
    ).catch((e: Error) => {
      console.error('Failed to update: ', e);
      toast.error('Failed to update: ' + e.message);
      error = true;
    });

    if (!error) {
      toast.success('Changes saved');
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
  function OnSubmitAddMember(values: z.infer<typeof addMemberFormSchema>) {
    let error = false;

    AddMemberToOrganization(organization.id, values.memberIdentifier).catch((e: Error) => {
      console.error('Failed to add member: ', e);
      toast.error('Failed to add member: ' + e.message);
      error = true;
    });

    if (!error) {
      toast.success('Member added');
    }
  }

  return (
    <div className="self-center p-12 md:p-24 w-screen max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">Edit Organization Details</h2>
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
                  <Input placeholder={organization.description || undefined} {...field} />
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

      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-bold">Manage Members</h2>
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Current Members ({organization.members.length})
          </h3>
          {organization.members.length === 0 ? (
            <p className="text-gray-500">No members yet.</p>
          ) : (
            <ul className="list-disc list-inside">
              {/* Ensure User type from Prisma is sufficient or adjust include in page.tsx */}
              {organization.members.map((member) => (
                <li key={member.id}>
                  {member.username || member.email || `User ID: ${member.userId}`}
                </li> // Display username or email
              ))}
            </ul>
          )}
          {/* Optional: Add functionality to remove members here */}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Add New Member</h3>
          <Form {...addMemberForm}>
            {' '}
            {/* Use addMemberForm */}
            <form onSubmit={addMemberForm.handleSubmit(OnSubmitAddMember)} className="space-y-4">
              {' '}
              <FormField
                control={addMemberForm.control}
                name="memberIdentifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter username or email" {...field} />
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
        </div>
      </div>
    </div>
  );
}
