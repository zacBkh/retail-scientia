'use client'

import { FC } from 'react'

import type { UserWithoutPwd } from '@/types'

import { mutate } from 'swr'
import useSWRImmutable from 'swr/immutable'
import { SWR_KEYS } from '@/constants'

interface propsType {
  data: UserWithoutPwd[]
}

import { DataTableAddNewUser } from '@/components/shad/tables/tables-wrapper/data-table-add-new-user'
import { columnAddNewUser } from '@/components/shad/tables/columns/add-new-user/columns-add-new-user'

import { deleteUser } from '@/services/fetchers-api'

import { AccountType } from '@prisma/client'

import { getUsers } from '@/services/fetchers-api'

import { getAsyncToast } from '@/utils/get-async-toaster'

const DataTableCltWrapper: FC<propsType> = ({ data }) => {
  const { data: users } = useSWRImmutable(
    SWR_KEYS.GET_USERS,
    async () => {
      const users = await getUsers(Object.values(AccountType))
      return users.result
    },
    { fallbackData: data }
  )

  const onDeleteUserRequest = async (userID: number) => {
    await getAsyncToast(() => deleteUser(userID))
    mutate(SWR_KEYS.GET_USERS)
  }

  const onEditUserRequest = (userID: number) => {
    console.log('edit user request', userID)
  }

  return (
    <>
      <DataTableAddNewUser
        columns={columnAddNewUser(onDeleteUserRequest, onEditUserRequest)}
        data={users ?? []}
      />
    </>
  )
}

export default DataTableCltWrapper
