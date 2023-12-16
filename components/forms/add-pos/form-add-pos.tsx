'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shad/ui/form'
import { Input } from '@/components/shad/ui/input'

import { Button } from '@/components/shad/ui/button'

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .refine((data) => data.length > 0, {
      message: 'Name is required.',
    }),
  country: z
    .string()
    .trim()
    .refine((data) => data.length > 0, {
      message: 'Country is required.',
    }),
})

const NewPOSForm = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      country: '',
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('FORM submit --->', values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name of the POS</FormLabel>
              <FormControl>
                <Input placeholder="Bloomingdales Dubai Mall" {...field} />
              </FormControl>
              <div className="flex flex-col mt-1">
                <FormDescription>
                  This is the name of your new POS.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="United Arab Emirates" {...field} />
              </FormControl>
              <div className="flex flex-col mt-1">
                <FormDescription>
                  This is the country of your new POS.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button className="flex items-center mt-6" size={'sm'} type="submit">
          Create
        </Button>
      </form>
    </Form>
  )
}
export default NewPOSForm
