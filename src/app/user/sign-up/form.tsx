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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CreateInterests, GetCategories } from './submit';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  categories: z.array(z.number()).refine((arr) => arr.length >= 3, {
    message: `You must select at least three interests.`,
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

/**
 * A form component for user sign-up that allows selection of interests from various categories.
 * The form fetches categories and their subcategories from the server, displays them in a scrollable area,
 * and allows users to select at least three interests before submission.
 * @returns {Element} - SignUpForm component
 */
export default function SignUpForm() {
  const router = useRouter();
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
      categories: [],
    },
  });

  /**
   * Handles form submission by creating user interests and redirecting to home page on success.
   * Shows toast notifications for success/error states.
   * @param {z.infer<typeof formSchema>} values - The form data containing selected subcategory IDs
   */
  function onSubmit(values: z.infer<typeof formSchema>) {
    CreateInterests({
      interests: values.categories,
    })
      .then((status) => {
        if (status === 0) {
          toast.error('An unexpected error occured (status: 0)');
        } else {
          toast.success('Interests saved');
          router.push(`/`);
        }
      })
      .catch((e: Error) => {
        console.error(e.message);
        toast.error('An unexpected error occured');
      });
  }

  return (
    <div className="self-center md:p-12 w-screen max-w-4xl">
      <Card className='md:mt-6'>
        <CardHeader>
          <CardTitle>Complete your onboarding</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
