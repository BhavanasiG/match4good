/**
 * Contains the profile form for the settings page
 * containing basic profile information such as
 * username, email and biography
 * @param Props accepts a prisma user object to display
 * @returns ProfileForm component JSX
 */

"use client";

import { User } from "@/lib/prisma";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UpdateUser } from "./submit";

/** Profile form schema */

const form_schema = z.object({
  username: z
    .string()
    .min(4, {
      message: "Username must be at least 4 characters.",
    })
    .max(20, {
      message: "Username cannot be longer than 20 characters.",
    }),
  email: z
    .string()
    .min(1, {
      message: "This field is required",
    })
    .email("This is not a valid email address."),
  bio: z.string().max(160).optional(),
});

export type Props = { user: User };

/**
 *
 * @param {User} param0 - user: The user object to display
 * @returns {Element} - Returns a form for updating the user's profile
 */
export default function ProfileForm({ user }: Props) {
  /**
   * Make sure to include defaultValues for each form or
   * Next.js will not be happy about controlled and uncontrolled inputs
   */

  /* eslint-disable @typescript-eslint/naming-convention */

  const form = useForm<z.infer<typeof form_schema>>({
    resolver: zodResolver(form_schema),
    defaultValues: {
      username: user.username,
      email: user.email || "",
      bio: user.bio || "",
    },
  });

  /**
   *
   * @param {z.infer<typeof form_schema>} values Form values
   * Handles form submission and updates the user profile
   */
  function OnSubmit(values: z.infer<typeof form_schema>) {
    let error = false;

    UpdateUser(values.username, values.bio || null).catch(
      (e: Error) => {
        console.error("Failed to update: ", e);
        toast.error("Failed to update: " + e.message);
        error = true;
      },
    );

    if (!error) {
      toast.success("Changes saved");
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
              <FormDescription>
                This is your public display name.
              </FormDescription>
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
                <Input
                  placeholder={user.email || "example@mailservice.com"}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The email address associated with this account.
              </FormDescription>
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
                <Input
                  placeholder={"Tell us a little bit more about yourself."}
                  {...field}
                />
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
