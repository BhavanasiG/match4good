/**
 * Contains the profile form for the settings page
 * containing basic profile information such as
 * username, email and biography
 * @param Props accepts a prisma user object to display
 * @returns ProfileForm component JSX
 */

'use client';

import { User } from '@/lib/prisma';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { UpdateUser } from './submit';
import { Textarea } from '@/components/ui/textarea';

/** Profile form schema */

/**
 * Zod schema for the User Profile form data.
 * Validates username, email, and optional biography.
 * @property {string} username - User's username (min 4, max 20 characters).
 * @property {string} email - User's email address (required, valid email format).
 * @property {string | undefined} bio - Optional user biography (max 160 characters).
 */
const formSchema = z.object({
  username: z
    .string()
    .min(4, {
      message: 'Username must be at least 4 characters.',
    })
    .max(20, {
      message: 'Username cannot be longer than 20 characters.',
    }),
  email: z
    .string()
    .min(1, {
      message: 'This field is required',
    })
    .email('This is not a valid email address.'),
  bio: z.string().max(160).optional(),
});

/**
 * Client component providing a form to update the user's profile information (username, email, biography).
 * @param {object} props - Component props.
 * @param {User} props.user - The user object whose profile is being edited.
 * @returns {Element} The Profile Settings form component UI.
 */
export default function ProfileForm({ user }: { user: User }) {
  /**
   * Make sure to include defaultValues for each form or
   * Next.js will not be happy about controlled and uncontrolled inputs
   */

  /* eslint-disable @typescript-eslint/naming-convention */

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.username,
      email: user.email || '',
      bio: user.bio || '',
    },
  });

  /**
   * Handles the submission of the profile form.
   * Calls the server action to update the user profile and provides toast feedback.
   * @param {z.infer<typeof formSchema>} values - The validated form values.
   */
  function OnSubmit(values: z.infer<typeof formSchema>) {
    let error = false;

    UpdateUser(values.username, values.email, values.bio || null).catch((e: Error) => {
      console.error('Failed to update: ', e);
      toast.error('Failed to update: ' + e.message);
      error = true;
    });

    if (!error) {
      toast.success('Changes saved');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(OnSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder={user.username} {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder={user.email || 'example@mailservice.com'} {...field} />
              </FormControl>
              <FormDescription>The email address associated with this account.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biography</FormLabel>
              <FormControl>
                <Textarea placeholder={'Tell us a little bit more about yourself.'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
}
