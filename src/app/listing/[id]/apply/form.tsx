'use client';

import createApplication from './actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconCheck } from '@tabler/icons-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';

/**
 * Zod schema for the application form data.
 * @property {string | undefined} comment - Optional comment field, max 500 characters.
 */
const formSchema = z.object({
  comment: z.string().max(500).optional(),
});

/**
 * Application form component for users to apply for a listing.
 * @param {object} props - Component props.
 * @param {number} props.listingId - The ID of the listing to which the application is being made.
 * @returns {Element} A React form component.
 */
export default function ApplicationForm({ listingId }: { listingId: number }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: '',
    },
  });

  /**
   * Handles the submission of the application form.
   * Calls the server action to create the application.
   * @param {z.infer<typeof formSchema>} values - The validated form values.
   */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createApplication(listingId, values.comment || null);
  }

  return (
    <Card className="p-6 bg-accent text-accent-foreground">
      <CardHeader className="p-0">
        <CardTitle className="font-semibold text-2xl">Your Application</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>Write a message to the organizer</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="cursor-pointer">
              Apply
              <IconCheck />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
