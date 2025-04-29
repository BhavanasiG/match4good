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
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

//import { ChangeEvent, FormEvent, useState } from "react";
//import { createInterests, CreateInterestsData } from "./submit";

const formSchema = z.object({
  categories: z.array(z.string()).refine((value) => value.length >= 3, {
    message: `You must select at least three interests.`,
  }),
});

/**
 * A form component for user sign-up that allows selection of interests from various categories.
 * @param {object} props - The component props
 * @param {Array<{name: string, description: string | null, id: number}>} props.categories - List of primary interest categories
 * @param {Array<{name: string, description: string | null, primaryCategoryId: number}>} props.subcategories - List of subcategories with their parent category IDs
 * @returns {Element} A form with toggleable interest selections
 */
export default function SignUpForm({
  categories,
  subcategories,
}: {
  categories: { name: string; description: string | null; id: number }[];
  subcategories: { name: string; description: string | null; primaryCategoryId: number }[];
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categories: [],
    },
  });

  /**
   * Handles form submission when the user has selected their interests.
   * @param {object} data - The form data containing selected categories
   * @param {string[]} data.categories - Array of selected subcategory names
   */
  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }

  return (
    <div className="self-center p-12 md:p-24 w-screen max-w-4xl">
      <Card className="mt-6">
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
                    <FormLabel className="text-base">Select Interests</FormLabel>
                    <FormDescription className="text-sm">
                      Select at least three interests.
                    </FormDescription>
                    <div className="space-y-6 mt-4">
                      {categories.map((category) => (
                        <div key={category.name}>
                          <h2 key={category.name} className="font-semibold text-base mb-4">
                            {category.name}
                          </h2>
                          <div className="flex flex-wrap space-x-2 space-y-2">
                            {subcategories
                              .filter(
                                (subcategory) => subcategory.primaryCategoryId === category.id,
                              )
                              .map((subcategory) => (
                                <FormField
                                  key={subcategory.name}
                                  control={form.control}
                                  name="categories"
                                  render={({ field }) => (
                                    <FormItem key={subcategory.name}>
                                      <FormControl>
                                        <Toggle
                                          size={'lg'}
                                          variant={'outline'}
                                          className="w-fit hover:cursor-pointer"
                                          pressed={field.value?.includes(subcategory.name)}
                                          onPressedChange={(checked) => {
                                            const currentValues = field.value || [];
                                            const newValues = checked
                                              ? [...currentValues, subcategory.name]
                                              : currentValues.filter(
                                                  (value) => value !== subcategory.name,
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
                      ))}
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
