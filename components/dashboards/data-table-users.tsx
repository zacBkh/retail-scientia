'use client'

import { FC, useState } from 'react'

import type { UserWithPOSAndBrands } from '@/types'

import { mutate } from 'swr'
import useSWRImmutable from 'swr/immutable'
import { SWR_KEYS } from '@/constants'

import { TypeEditUserForm } from '../forms/edit-user/form-edit-user'

interface DataTableUsersProps {
  data: UserWithPOSAndBrands[]
}

import { DataTableManageUsers } from '@/components/shad/tables/tables-wrapper/data-table-manage-users'
import { columnManageUsers } from '@/components/shad/tables/columns/add-new-user/columns-manage-users'

import { AccountType } from '@prisma/client'

import { getUsers, editUser, deleteUser } from '@/services/fetchers-api'

import { getAsyncToast } from '@/utils/get-async-toaster'

const DataTableUsers: FC<DataTableUsersProps> = ({ data }) => {
  const { data: users } = useSWRImmutable(
    SWR_KEYS.GET_USERS,
    async () => {
      const users = await getUsers(Object.values(AccountType))
      return users.result
    },
    { fallbackData: data, revalidateOnMount: true }
  )

  const onDeleteUserConfirmation = async (userId: number) => {
    await getAsyncToast(() => deleteUser(userId))
    mutate(SWR_KEYS.GET_USERS)
  }

  // Query db to update && mutate list of users
  const onEditUserConfirmation = async (
    userId: number,
    editedUserData: TypeEditUserForm
  ) => {
    await getAsyncToast(() => editUser(userId, editedUserData))
    mutate(SWR_KEYS.GET_USERS)
  }

  return (
    <DataTableManageUsers
      columns={columnManageUsers(
        onDeleteUserConfirmation,
        onEditUserConfirmation
      )}
      data={users ?? []}
    />
  )
}

export default DataTableUsers
