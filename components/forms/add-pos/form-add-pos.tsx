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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/shad/ui/select'

import worldCountries from '@/constants/countries-data'

import Image from 'next/image'

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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      country: '',
    },
  })

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
              <FormLabel className="font-semibold">
                Country of the POS
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-52">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent
                  position="popper"
                  align="start"
                  side="top"
                  className="h-80 w-64"
                >
                  <SelectGroup>
                    <SelectLabel>Countries</SelectLabel>
                    {worldCountries.map((country) => (
                      <SelectItem
                        className="cursor-pointer px-2"
                        key={country.iso3}
                        value={country.iso3}
                      >
                        <div className="flex items-center gap-x-3 my-2">
                          <Image
                            objectFit="contain"
                            src={country.flag}
                            alt={`Flag of ${country.name}`}
                            width={30}
                            height={30}
                          />
                          <div>{country.name}</div>
                          <div></div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="flex flex-col mt-1">
                <FormDescription>Country of your new POS.</FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button className="flex items-center" size={'sm'} type="submit">
          Create
        </Button>
      </form>
    </Form>
  )
}
export default NewPOSForm
