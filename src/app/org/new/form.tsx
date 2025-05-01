'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { CreateOrganization } from './submit';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z
    .string()
    .min(4, {
      message: 'Name must be at least 4 characters.',
    })
    .max(32, {
      message: 'Name cannot be longer than 32 characters.',
    }),
  description: z.string().max(400).optional(),
  address: z
    .string()
    .min(4, {
      message: 'Address must be at least 4 characters.',
    })
    .max(64, {
      message: 'Address cannot be longer than 64 characters.',
    }),
  postcode: z
    .string()
    .min(6, {
      message: 'Postcode must be at least 6 characters.',
    })
    .max(8, {
      message: 'Postcode cannot be longer than 8 characters.',
    })
    .regex(/^([A-Z][A-HJ-Y]?\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/, {
      message: 'Invalid postcode format',
    }),
});

const validateAddress = async (address: string, postcode: string): Promise<boolean> => {
  const query = encodeURIComponent(`${address}, ${postcode}, UK`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json`;

  const res = await fetch(url);
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  const data = await res.json();
  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  /* eslint-disable @typescript-eslint/no-unsafe-return */
  return data && data.length > 0;
};

/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Form component for creating new organizations.
 * @returns {Element} A form with fields for creating a new organization
 */
export default function CreateOrganizationForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      postcode: '',
    },
  });

  /**
   * Handles the submission of the form.
   * @param {z.infer<typeof formSchema>} values - The values of the form
   */
  async function OnSubmit(values: z.infer<typeof formSchema>) {
    const isValid = await validateAddress(values.address, values.postcode);
  
    if (!isValid) {
      toast.error('Address not found. Please enter a valid UK address.');
      return;
    }
  
    CreateOrganization({
      name: values.name,
      description: values.description || '',
      address: values.address,
      postcode: values.postcode,
    })
      .then((status) => {
        if (status === 0) {
          toast.error('An organization with that name already exists.');
        } else {
          toast.success('Organization created successfully!');
          router.push(`/org/${status}`);
        }
      })
      .catch((e: Error) => {
        console.error(e.message);
        toast.error('An unexpected error occurred');
      });
  }
  

  return (
    <div className="self-center p-12 md:p-24 w-screen max-w-4xl">
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Create Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(OnSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Tell us a bit about your organization.</FormDescription>
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
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Where your organization is situated.</FormDescription>
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="hover:cursor-pointer">
                Create
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
