'use client'

import { FC } from 'react'

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

import { APIResponseBasic } from '@/types'

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

export type TypeAddPostData = z.infer<typeof formSchema>

interface AddFormProps {
  onFormAdded: (newPOS: z.infer<typeof formSchema>) => void
}

const NewPOSForm: FC<AddFormProps> = ({ onFormAdded }) => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      country: '',
    },
  })

  // 2. Define a submit handler.
  const onSubmitNewPOS = async (newPOS: z.infer<typeof formSchema>) => {
    onFormAdded(newPOS)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitNewPOS)}
        className="flex flex-col gap-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Name of the POS</FormLabel>
              <FormControl>
                <Input placeholder="Bloomingdales Dubai Mall" {...field} />
              </FormControl>
              <div className="flex flex-col mt-1">
                <FormDescription>Name of your new POS.</FormDescription>
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
              <FormLabel className="font-semibold">Country</FormLabel>
              <FormControl>
                <Input placeholder="United Arab Emirates" {...field} />
              </FormControl>
              <div className="flex flex-col mt-1">
                <FormDescription>Country of your new POS.</FormDescription>
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
