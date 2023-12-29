'use client'

import { FC } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { AccountType } from '@prisma/client'
const accountTypeValues: string[] = Object.values(AccountType)

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
import { Checkbox } from '@/components/shad/ui/checkbox'

import useSWRImmutable from 'swr/immutable'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/shad/ui/select'

import { SWR_KEYS } from '@/constants'

import { getUniqueBrandsOfUser, getPOS } from '@/services/fetchers-api'

import type { GetUniqueBrandsRespFull } from '@/services/fetchers-api'
import { APIResponseBasic } from '@/types'

import { useSession } from 'next-auth/react'

import Spinner from '@/components/ui/spinner'

const formSchemaAddUser = z
  .object({
    accountType: z.nativeEnum(AccountType, {
      invalid_type_error: 'Account Type is invalid.',
      required_error: 'Account Type is required.',
      description: 'Please select one Account Type',
    }),

    name: z
      .string()
      .trim()
      .refine((data) => data.length > 0, {
        message: 'Name is required.',
      }),

    email: z.string().trim().email({ message: 'Invalid email address' }),

    password: z
      .string()
      .trim()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(
        /^(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\-])(?=.*\d)(?=.*[A-Z])/,
        'Your password requires one number, one uppercase letter and one special character.'
      ),

    staffID: z.string().trim().optional(),

    brands: z
      .array(z.number())
      .nonempty({ message: 'At least one Brand is required.' }),
    // refine if is not included in result of getUniqueBrands
    // .refine((data) => data.length > 0, {
    //   message: 'Name is required.',
    // }),

    pointOfSaleId: z.string().optional(),
    // refine if is not included in result of getUniqueBrands
    // .refine((data) => data.length > 0, {
    //   message: 'Name is required.',
    // }),
  })
  .refine(
    (schema) =>
      //  allows pointOfSaleId to be optional when accountType is 'Staff'
      // if send true it means it will pass
      schema.accountType !== 'Staff' ||
      (schema.accountType === 'Staff' && schema.pointOfSaleId),
    {
      message: 'Required when Account Type is Staff.',
      path: ['pointOfSaleId'], // path of error
    }
  )

export type TypeAddEditUser = z.infer<typeof formSchemaAddUser>

interface AddFormProps {
  onConfirmForm: (newUser: z.infer<typeof formSchemaAddUser>) => void
}

const NewUserForm: FC<AddFormProps> = ({ onConfirmForm }) => {
  const { data: session } = useSession()

  const form = useForm<z.infer<typeof formSchemaAddUser>>({
    resolver: zodResolver(formSchemaAddUser),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      staffID: '',
      accountType: undefined,
      brands: [],
      pointOfSaleId: undefined,
    },
  })

  const onSubmitNewUser = async (
    newUser: z.infer<typeof formSchemaAddUser>
  ) => {
    onConfirmForm(newUser)
  }

  const formValues = form.getValues()
  const subscribeAccountType = form.watch('accountType')

  const isStaffDirty = subscribeAccountType !== undefined
  const isStaff = subscribeAccountType === AccountType.Staff

  const accountTypeChangeHandler = (accType: AccountType) => {
    form.resetField('pointOfSaleId')
    form.resetField('staffID')
  }

  const {
    data: brands,
    error: errorBrands,
    isLoading: isLoadingBrands,
    isValidating: isValidatingBrands,
  } = useSWRImmutable(
    SWR_KEYS.GET_BRANDS_OF_USER_FULL,
    () =>
      getUniqueBrandsOfUser(session?.user.id) as Promise<
        APIResponseBasic<GetUniqueBrandsRespFull[]>
      >,
    {
      revalidateOnMount: true,
    }
  )
  const {
    data: POS,
    error: errorPOS,
    isLoading: isLoadingPOS,
    isValidating: isValidatingPOS,
  } = useSWRImmutable(SWR_KEYS.GET_POS, () => getPOS(), {
    revalidateOnMount: true,
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitNewUser)}
        className="flex flex-col gap-y-6 px-1"
      >
        <FormField
          control={form.control}
          name="accountType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Account type</FormLabel>
              <Select
                onValueChange={(value: AccountType) => {
                  field.onChange(value)
                  accountTypeChangeHandler(value)
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-52">
                    <SelectValue placeholder="Select an Account Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent
                  position="popper"
                  align="start"
                  side="top"
                  className="h-fit w-64"
                >
                  <SelectGroup>
                    <SelectLabel className="-ml-5">Account Types</SelectLabel>
                    {accountTypeValues.map((accType) => (
                      <SelectItem
                        className="cursor-pointer"
                        key={accType}
                        value={accType}
                      >
                        <span>{accType}</span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="flex flex-col mt-1">
                <FormDescription>
                  What kind of user are you registering?
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {isStaffDirty ? (
          <>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Name of the user
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Jovia Espino" {...field} />
                  </FormControl>
                  <div className="flex flex-col mt-1">
                    <FormDescription>Name of your new user.</FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="jovia@live.fr" {...field} />
                  </FormControl>
                  <div className="flex flex-col mt-1">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Password of the user
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <div className="flex flex-col mt-1">
                    <FormDescription>
                      Make sure to select a complex password.
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            {isStaff && (
              <FormField
                control={form.control}
                name="staffID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Staff ID</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g: 97185-A" {...field} />
                    </FormControl>
                    <div className="flex flex-col mt-1">
                      <FormDescription>
                        Optional internal staff ID to recognize your user.
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="brands"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4 flex flex-col">
                    <FormLabel className="text-base">Brands</FormLabel>
                    <FormDescription>
                      Select brand(s) you want to associate this user with.
                    </FormDescription>
                  </div>

                  {isLoadingBrands ? (
                    <Spinner size="w-5 h-5" />
                  ) : (
                    brands?.result?.map((item) => (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0 mt-2"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {item.name}
                        </FormLabel>
                      </FormItem>
                    ))
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />

            {isStaff ? (
              <FormField
                control={form.control}
                name="pointOfSaleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Point of Sale
                    </FormLabel>
                    <div className="flex flex-col mb-1">
                      <FormDescription>
                        On which POS is this person working?
                      </FormDescription>
                      <FormMessage />
                    </div>
                    {isLoadingPOS ? (
                      <Spinner size="w-5 h-5" />
                    ) : (
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-52">
                            <SelectValue placeholder="Select a POS" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent
                          position="popper"
                          align="start"
                          side="top"
                          className="h-fit w-64"
                        >
                          <SelectGroup>
                            <SelectLabel className="-ml-5">
                              Point of Sale
                            </SelectLabel>
                            {POS?.result?.map((pos) => (
                              <SelectItem
                                className="cursor-pointer"
                                key={pos.id}
                                value={`${pos.id}`}
                              >
                                <span>{pos.name}</span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  </FormItem>
                )}
              />
            ) : (
              ''
            )}
          </>
        ) : (
          ''
        )}

        <Button className="flex items-center" size={'sm'} type="submit">
          Create User
        </Button>
      </form>
    </Form>
  )
}
export default NewUserForm
