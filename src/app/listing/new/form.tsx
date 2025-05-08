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
import { CreateListing, GetCategories } from './submit';
import { User } from '@/lib/prisma';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconCalendarWeek, IconClock } from '@tabler/icons-react';
import { siteContact } from '@/config/siteConfig';
import { useEffect, useState } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

/* zod uses ISO 8601 format for date and time, but server only returns YYYY-MM-DDTHH:MM instead of YYYY-MM-DDTHH:MM:SS, so z.string().datetime() is ignored */
const formSchema = z.object({
  name: z
    .string()
    .min(4, {
      message: 'Name must be at least 4 characters.',
    })
    .max(32, {
      message: 'Name cannot be longer than 32 characters.',
    }),
  dateRange: z
    .object({
      startDatetime: z.string().refine((data) => new Date(data) > new Date(), {
        message: 'Start date and time cannot be in the past.',
      }),
      endDatetime: z.string().refine((data) => new Date(data) > new Date(), {
        message: 'End date and time cannot be in the past.',
      }),
    })
    .refine((data) => data.startDatetime < data.endDatetime, {
      message: 'End date and time cannot be before start date and time',
      path: ['endDatetime'],
    }),
  description: z.string().max(400).optional(),
  organization: z.number(),
  categories: z.array(z.number()).refine((arr) => arr.length >= 1, {
    message: 'You must select at least one category.',
  }),
});

interface Category {
  id: number;
  name: string;
  description: string | null;
  subcategories: {
    id: number;
    name: string;
    description: string | null;
  }[];
}

/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Form component for creating new volunteering opportunities.
 * @param {User} user - The current user object containing organization memberships
 * @returns {Element} A form with fields for creating a new volunteering listing
 */
export default function CreateListingForm({ user }: { user: User }) {
  const userOrgs = [...new Set([...user.ownerOf, ...user.memberOf])];
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await GetCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories().catch((e: Error) => {
      console.log('Error fetching categories: ' + e.message);
    });
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      dateRange: {
        startDatetime: '',
        endDatetime: '',
      },
      categories: [],
    },
  });

  /**
   * Handles the submission of the form.
   * @param {z.infer<typeof formSchema>} values - The values of the form
   */
  function OnSubmit(values: z.infer<typeof formSchema>) {
    CreateListing({
      name: values.name,
      description: values.description || '',
      dateRange: {
        startDatetime: values.dateRange.startDatetime,
        endDatetime: values.dateRange.endDatetime,
      },
      organizationId: values.organization,
      categories: values.categories,
    }).catch((e: Error) => {
      console.error(e);
    });

    toast.success('Listing created successfully!');
  }

  return (
    <div className="self-center p-12 md:p-24 w-screen max-w-4xl">
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Create Volunteering Opportunity</CardTitle>
          <p className="text-sm text-muted-foreground">
            Or email us directly at {siteContact.email}
          </p>
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
                    <FormDescription>Describe your volunteering opportunity.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateRange.startDatetime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start date & time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={Cn(
                              'w-[240px] font-normal justify-start',
                              field.value && 'text-muted-foreground',
                            )}
                          >
                            <IconCalendarWeek className="h-4 w-4 opacity-50" />
                            <p className="w-full flex justify-between">
                              {field.value ? (
                                <span>
                                  {new Date(field.value).toLocaleDateString('en-GB', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                  })}
                                </span>
                              ) : (
                                <span>Select date</span>
                              )}
                            </p>
                            <IconClock className="h-4 w-4 opacity-50" />
                            <p>
                              {field.value ? (
                                <span>
                                  {new Date(field.value).toLocaleTimeString('en-GB', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
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
                name="dateRange.endDatetime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End date & time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={Cn(
                              'w-[240px] font-normal justify-start',
                              field.value && 'text-muted-foreground',
                            )}
                          >
                            <IconCalendarWeek className="h-4 w-4 opacity-50" />
                            <p className="w-full flex justify-between">
                              {field.value ? (
                                <span>
                                  {new Date(field.value).toLocaleDateString('en-GB', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                  })}
                                </span>
                              ) : (
                                <span>Select date</span>
                              )}
                            </p>
                            <IconClock className="h-4 w-4 opacity-50" />
                            <p>
                              {field.value ? (
                                <span>
                                  {new Date(field.value).toLocaleTimeString('en-GB', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
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
                          min={form.getValues('dateRange.startDatetime')}
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
                          variant={'outline'}
                          className={Cn(
                            'w-[240px] font-normal justify-start',
                            field.value && 'text-muted-foreground',
                          )}
                        >
                          {userOrgs.find((org) => org.id === field.value)?.name ||
                            'Select an organization'}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {userOrgs.map((org) => (
                          <DropdownMenuItem key={org.id} onClick={() => field.onChange(org.id)}>
                            {org.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categories"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-sm md:text-base">Select Interests</FormLabel>
                    <FormDescription className="text-sm">
                      Select at least three interests.
                    </FormDescription>
                    <div className="space-y-6 mt-4">
                      <ScrollArea className="h-[300px] md:h-[500px]">
                        {isLoading ? (
                          <div>Loading categories...</div>
                        ) : (
                          categories.map((category) => (
                            <div key={category.name}>
                              <h2 className="font-semibold text-base mb-4">{category.name}</h2>
                              <div className="flex flex-wrap space-x-2 space-y-2 mb-8">
                                {category.subcategories.map((subcategory) => (
                                  <FormField
                                    key={subcategory.name}
                                    control={form.control}
                                    name="categories"
                                    render={({ field }) => (
                                      <FormItem key={subcategory.name}>
                                        <FormControl>
                                          <Toggle
                                            size={'sm'}
                                            variant={'outline'}
                                            className="w-fit hover:cursor-pointer"
                                            pressed={field.value?.includes(subcategory.id)}
                                            onPressedChange={(checked) => {
                                              const currentValues = field.value || [];
                                              const newValues = checked
                                                ? [...currentValues, subcategory.id]
                                                : currentValues.filter(
                                                    (value) => value !== subcategory.id,
                                                  );
                                              field.onChange(newValues);
                                            }}
                                          >
                                            <TooltipProvider>
                                              <Tooltip delayDuration={700}>
                                                <TooltipTrigger asChild>
                                                  <span>{subcategory.name}</span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  <p>{subcategory.description}</p>
                                                </TooltipContent>
                                              </Tooltip>
                                            </TooltipProvider>
                                          </Toggle>
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                          ))
                        )}
                        <ScrollBar />
                      </ScrollArea>
                    </div>
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
