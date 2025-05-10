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
import { UpdateOrganization } from './submit';

const formSchema = z.object({
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

/**
 *
 * @param {Organization} param0 - organization: The organization object to display
 * @returns {Element} - Returns a form for updating the organization's information
 */
export default function EditOrganizationForm({ organization }: { organization: Organization }) {
  /* eslint-disable @typescript-eslint/naming-convention */
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: organization.name,
      description: organization.description || '',
      address: organization.address || '',
      postcode: organization.postcode || '',
    },
  });

  /**
   * Handles the form submission
   * @param {z.infer<typeof formSchema>} values - The values from the form
   */
  function OnSubmit(values: z.infer<typeof formSchema>) {
    toast.loading('Saving changes...');
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
    toast.dismiss();

    if (!error) {
      toast.success('Changes saved');
    }
  }

  return (
    <div className="self-center p-12 md:p-24 w-screen max-w-4xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(OnSubmit)} className="space-y-8">
          <FormField
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
    </div>
  );
}
