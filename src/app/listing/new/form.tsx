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
import { createListing } from "./submit";
import { User } from "@/lib/prisma";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconCalendarWeek, IconClock } from "@tabler/icons-react";

/* zod uses ISO 8601 format for date and time, but server only returns YYYY-MM-DDTHH:MM instead of YYYY-MM-DDTHH:MM:SS, so z.string().datetime() is ignored */
const form_schema = z.object({
  name: z
    .string()
    .min(4, {
      message: "Name must be at least 4 characters.",
    })
    .max(32, {
      message: "Name cannot be longer than 32 characters.",
    }),
  date_range: z
    .object({
      start_datetime: z.string().refine((data) => new Date(data) > new Date(), {
        message: "Start date and time cannot be in the past.",
      }),
      end_datetime: z.string().refine((data) => new Date(data) > new Date(), {
        message: "End date and time cannot be in the past.",
      }),
    })
    .refine((data) => data.start_datetime < data.end_datetime, {
      message: "End date and time cannot be before start date and time",
      path: ["end_datetime"],
    }),
  description: z.string().max(400).optional(),
  organization: z.number(),
});

/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Form component for creating new volunteering opportunities.
 * @param {User} user - The current user object containing organization memberships
 * @returns {Element} A form with fields for creating a new volunteering listing
 */
export default function CreateListingForm(user: User) {
  const user_orgs = [...new Set([...user.owner_of, ...user.member_of])];

  const form = useForm<z.infer<typeof form_schema>>({
    resolver: zodResolver(form_schema),
    defaultValues: {
      name: "",
      description: "",
      date_range: {
        start_datetime: "",
        end_datetime: "",
      },
    },
  });

  /**
   * Handles the submission of the form.
   * @param {z.infer<typeof form_schema>} values - The values of the form
   */
  function OnSubmit(values: z.infer<typeof form_schema>) {
    createListing({
      name: values.name,
      description: values.description || "",
      date_range: {
        start_datetime: values.date_range.start_datetime,
        end_datetime: values.date_range.end_datetime,
      },
      organization_id: values.organization,
    }).catch((e: Error) => {
      console.error(e);
    });

    toast.success("Organization created successfully!");
  }

  return (
    <div className="self-center p-12 md:p-24 w-screen max-w-4xl">
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Create Volunteering Opportunity</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(OnSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
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
                      Describe your volunteering opportunity.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_range.start_datetime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start date & time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] font-normal justify-start",
                              field.value && "text-muted-foreground",
                            )}
                          >
                            <IconCalendarWeek className="h-4 w-4 opacity-50" />
                            <p className="w-full flex justify-between">
                              {field.value ? (
                                <span>
                                  {new Date(field.value).toLocaleDateString(
                                    "en-GB",
                                    {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                    },
                                  )}
                                </span>
                              ) : (
                                <span>Select date</span>
                              )}
                            </p>
                            <IconClock className="h-4 w-4 opacity-50" />
                            <p>
                              {field.value ? (
                                <span>
                                  {new Date(field.value).toLocaleTimeString(
                                    "en-GB",
                                    { hour: "2-digit", minute: "2-digit" },
                                  )}
                                </span>
                              ) : (
                                <span>Select time</span>
                              )}
                            </p>
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="size-fit p-0" align="start">
                        <input
                          type="datetime-local"
                          onChange={field.onChange}
                          value={field.value}
                          min={new Date().toISOString().slice(0, 16)}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      The start date and time of the volunteering opportunity.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_range.end_datetime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End date & time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] font-normal justify-start",
                              field.value && "text-muted-foreground",
                            )}
                          >
                            <IconCalendarWeek className="h-4 w-4 opacity-50" />
                            <p className="w-full flex justify-between">
                              {field.value ? (
                                <span>
                                  {new Date(field.value).toLocaleDateString(
                                    "en-GB",
                                    {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                    },
                                  )}
                                </span>
                              ) : (
                                <span>Select date</span>
                              )}
                            </p>
                            <IconClock className="h-4 w-4 opacity-50" />
                            <p>
                              {field.value ? (
                                <span>
                                  {new Date(field.value).toLocaleTimeString(
                                    "en-GB",
                                    { hour: "2-digit", minute: "2-digit" },
                                  )}
                                </span>
                              ) : (
                                <span>Select time</span>
                              )}
                            </p>
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <input
                          type="datetime-local"
                          onChange={field.onChange}
                          value={field.value}
                          min={form.getValues("date_range.start_datetime")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      The end date and time of the volunteering opportunity.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] font-normal justify-start",
                            field.value && "text-muted-foreground",
                          )}
                        >
                          {user_orgs.find((org) => org.id === field.value)
                            ?.name || "Select an organization"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {user_orgs.map((org) => (
                          <DropdownMenuItem
                            key={org.id}
                            onClick={() => field.onChange(org.id)}
                          >
                            {org.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
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
