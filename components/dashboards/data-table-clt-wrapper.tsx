'use client'

import { FC, useState } from 'react'

import type { UserWithoutPwd } from '@/types'

import { mutate } from 'swr'
import useSWRImmutable from 'swr/immutable'
import { SWR_KEYS } from '@/constants'

interface DataTableCltWrapperProps {
  data: UserWithoutPwd[]
}

import { DataTableManageUsers } from '@/components/shad/tables/tables-wrapper/data-table-manage-users'
import { columnManageUsers } from '@/components/shad/tables/columns/add-new-user/columns-manage-users'

import { deleteUser } from '@/services/fetchers-api'

import { AccountType } from '@prisma/client'

import { getUsers } from '@/services/fetchers-api'

import { getAsyncToast } from '@/utils/get-async-toaster'

import EditUserDialog from '../forms/edit-user/edit-user-dialog'

const DataTableCltWrapper: FC<DataTableCltWrapperProps> = ({ data }) => {
  const [isDialogEditUserOpen, setIsDialogEditUserOpen] = useState(false)
  const [userUnderEdition, setUserUnderEdition] = useState<UserWithoutPwd>()

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

  const onEditUserRequest = (userDataToEdit: UserWithoutPwd) => {
    setIsDialogEditUserOpen(true)
    setUserUnderEdition(userDataToEdit)
  }

  return (
    <DataTableManageUsers
      columns={columnManageUsers(onDeleteUserRequest, onEditUserRequest)}
      data={users ?? []}
    >
      <EditUserDialog
        isOpen={isDialogEditUserOpen}
        userUnderEdition={userUnderEdition}
        onOpenChangeHandler={setIsDialogEditUserOpen}
      />
    </DataTableManageUsers>
  )
}

export default DataTableCltWrapper
