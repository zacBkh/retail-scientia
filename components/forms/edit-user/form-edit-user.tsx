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

import Spinner from '@/components/ui/spinner'

import { SWR_KEYS } from '@/constants'

import { getUniqueBrandsOfUser, getPOS } from '@/services/fetchers-api'

import type { GetUniqueBrandsRespFull } from '@/services/fetchers-api'
import { APIResponseBasic, UserWithPOSAndBrands } from '@/types'

import { useSession } from 'next-auth/react'

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

    staffID: z.string().trim().optional(),

    brands: z
      .array(z.number())
      // .array(z.string())
      .nonempty({ message: 'At least one Brand is required.' }),

    pointOfSaleId: z.string().optional(),
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

export type TypeEditUserForm = z.infer<typeof formSchemaAddUser>

interface AddFormProps {
  onConfirmForm: (editedUserData: z.infer<typeof formSchemaAddUser>) => void
  defaultValuesUser: UserWithPOSAndBrands | undefined
}

const EdtiUserForm: FC<AddFormProps> = ({
  onConfirmForm,
  defaultValuesUser,
}) => {
  // console.log('defaultValuesUser', defaultValuesUser)

  const { data: session } = useSession()

  const { accountType, name, email, staffID, pointOfSale, brands } =
    defaultValuesUser || {}

  const arrayOfBrandNames = brands?.map((brand) => brand.id) ?? []

  const form = useForm<z.infer<typeof formSchemaAddUser>>({
    resolver: zodResolver(formSchemaAddUser),
    defaultValues: {
      name,
      email,
      staffID: staffID ?? '',
      accountType: accountType,
      brands: arrayOfBrandNames,
      pointOfSaleId: pointOfSale?.id.toString(),
    },
  })

  const onSubmitEditUser = async (
    editedUserData: z.infer<typeof formSchemaAddUser>
  ) => {
    onConfirmForm(editedUserData)
  }

  const subscribeAccountType = form.watch('accountType')

  const isAccountTypeDirty = subscribeAccountType !== undefined
  const isStaff = subscribeAccountType === AccountType.Staff

  const accountTypeChangeHandler = (newAccType: AccountType) => {
    // If go back to staff, reset to initial values for posid & SN
    if (newAccType === AccountType.Staff) {
      form.resetField('pointOfSaleId')
      form.resetField('staffID')
    } else {
      form.setValue('pointOfSaleId', undefined)
      form.setValue('staffID', '')
    }
  }

  const {
    data: brandsOfUser,
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
        onSubmit={form.handleSubmit(onSubmitEditUser)}
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

        {isAccountTypeDirty ? (
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
                    <FormDescription>Name of your user.</FormDescription>
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
            {/* <FormField
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
            /> */}
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
                <FormField
                  control={form.control}
                  name="brands"
                  render={() => (
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
                        brandsOfUser?.result?.map((item) => (
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
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
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
                    <div className="flex flex-col mt-1">
                      <FormDescription>
                        On which POS is this person working?
                      </FormDescription>
                      <FormMessage />
                    </div>
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
          Edit User
        </Button>
      </form>
    </Form>
  )
}
export default EdtiUserForm
