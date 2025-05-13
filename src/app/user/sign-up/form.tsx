'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { GetRegions, CompleteSignup, GetCategories } from './submit';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  categories: z.array(z.number()).refine((arr) => arr.length >= 3, {
    message: `You must select at least three interests.`,
  }),
  regionId: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      required_error: 'Please select a region.',
    }),
  ),
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

interface Region {
  id: number;
  name: string;
}

/**
 * A form component for user sign-up that allows selection of interests and region.
 * Fetches categories and regions from the server.
 * @returns {Element} - SignUpForm component
 */
export default function SignUpForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [regions, setRegions] = useState<Region[]>([]);
  const [isRegionsLoading, setIsRegionsLoading] = useState(true);

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

    const fetchRegions = async () => {
      try {
        const data = await GetRegions();

        if ('success' in data && data.success === false) {
          console.error('Error fetching regions:', data.message);
          toast.error(data.message);
          setRegions([]);
        } else {
          setRegions(data as Region[]);
        }
      } catch (error) {
        console.error('Error fetching regions:', error);
        toast.error('Failed to load regions.');
        setRegions([]);
      } finally {
        setIsRegionsLoading(false);
      }
    };

    fetchCategories().catch((e: Error) => {
      console.log('Error fetching categories: ' + e.message);
    });

    fetchRegions().catch((e: Error) => {
      console.log('Error fetching regions: ' + e.message);
    });
  }, []);

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categories: [],
      regionId: '',
    },
  });

  /**
   * Handles form submission by completing user signup.
   * Saves selected interests and region, and redirects on success.
   * Shows toast notifications for success/error states.
   * @param {z.infer<typeof formSchema>} values - The form data containing selected subcategory IDs and regionId
   */
  const onSubmit: SubmitHandler<z.input<typeof formSchema>> = async (values) => {
    const toastId = toast.loading('Completing signup...');
    try {
      const validatedValues = values as z.infer<typeof formSchema>;
      const result = await CompleteSignup({
        interests: validatedValues.categories,
        regionId: validatedValues.regionId,
      });

      if (result.success) {
        toast.success(result.message, { id: toastId });
        router.push(`/`);
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch (error: unknown) {
      console.error('Failed to complete signup:', error);
      if (error instanceof Error) {
        toast.error(error.message, { id: toastId });
      } else {
        toast.error('An unexpected error occurred.', { id: toastId });
      }
    }
  };

  return (
    <div className="self-center md:p-12 w-screen max-w-4xl">
      <Card className="md:mt-6">
        <CardHeader>
          <CardTitle>Complete your onboarding</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="regionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Region</FormLabel>

                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      value={
                        field.value === null ||
                        field.value === undefined ||
                        typeof field.value === 'object'
                          ? ''
                          : // eslint-disable-next-line @typescript-eslint/no-base-to-string
                            String(field.value)
                      }
                      disabled={isRegionsLoading || regions.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isRegionsLoading
                                ? 'Loading regions...'
                                : regions.length > 0
                                  ? 'Select a region'
                                  : 'No regions available'
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region.id} value={String(region.id)}>
                            {' '}
                            {region.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the region you are primarily interested in or located in.
                    </FormDescription>
                    <FormMessage />
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
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
