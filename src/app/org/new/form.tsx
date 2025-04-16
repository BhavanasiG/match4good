"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { CreateOrganization } from "./submit";

const form_schema = z.object({
  name: z
    .string()
    .min(4, {
      message: "Name must be at least 4 characters.",
    })
    .max(32, {
      message: "Name cannot be longer than 32 characters.",
    }),
  description: z.string().max(400).optional(),
  address: z
    .string()
    .min(4, {
      message: "Address must be at least 4 characters.",
    })
    .max(64, {
      message: "Address cannot be longer than 64 characters.",
    }),
  postcode: z
    .string()
    .min(6, {
      message: "Postcode must be at least 6 characters.",
    })
    .max(8, {
      message: "Postcode cannot be longer than 8 characters.",
    })
    .regex(/^([A-Z][A-HJ-Y]?\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/, {
      message: "Invalid postcode format",
    }),
});

/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Form component for creating new organizations.
 * @returns {Element} A form with fields for creating a new organization
 */
export default function CreateOrganizationForm() {
  const form = useForm<z.infer<typeof form_schema>>({
    resolver: zodResolver(form_schema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      postcode: "",
    },
  });

  /**
   * Handles the submission of the form.
   * @param {z.infer<typeof form_schema>} values - The values of the form
   */
  function OnSubmit(values: z.infer<typeof form_schema>) {
    CreateOrganization({
      name: values.name,
      description: values.description || "",
      address: values.address,
      postcode: values.postcode,
    }).catch((e: Error) => {
      console.error(e);
    });

    toast.success("Organization created successfully!");
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
                    <FormDescription>
                      Tell us a bit about your organization.
                    </FormDescription>
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
                    <FormDescription>
                      Where your organization is situated.
                    </FormDescription>
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
