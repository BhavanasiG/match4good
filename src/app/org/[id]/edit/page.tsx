'use client';

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
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

export default function EditOrganization({ params }: { params: Promise<{ id: string }> }) {
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

  // ✅ Fetch organization details and prefill form
  useEffect(() => {
    async function fetchData() {
      const resolvedParams = await params;
      const res = await fetch(`/api/orgs/${resolvedParams.id}`, {
        method: 'GET',
      });

      if (!res.ok) {
        console.error(`API request failed: ${res.status}`);
        return;
      }

      const data = await res.json();
      form.reset({
        name: data.name ?? '',
        description: data.description ?? '',
        address: data.address ?? '',
        postcode: data.postcode ?? '',
      });
    }

    fetchData();
  }, [params, form]);

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    const resolvedParams = await params;
    const response = await fetch(`/api/orgs/${resolvedParams.id}`, {
      method: 'PUT',
      body: JSON.stringify(values),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      toast.success('Organization updated successfully!');
      router.push(`/org/${resolvedParams.id}`);
    } else {
      toast.error('Failed to update organization');
    }
  }

  return (
    <div className="self-center p-12 md:p-24 w-screen max-w-4xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
                  <Input {...field} />
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
                  <Input {...field} />
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
