'use client'

import { FC, useState } from 'react'

import type { UserWithPOSAndBrands } from '@/types'

import { mutate } from 'swr'
import useSWRImmutable from 'swr/immutable'
import { SWR_KEYS } from '@/constants'

import { TypeAddEditUser } from '../forms/edit-user/form-edit-user'

interface DataTableCltWrapperProps {
  data: UserWithPOSAndBrands[]
}

import { DataTableManageUsers } from '@/components/shad/tables/tables-wrapper/data-table-manage-users'
import { columnManageUsers } from '@/components/shad/tables/columns/add-new-user/columns-manage-users'

import { deleteUser, EditUserTypes } from '@/services/fetchers-api'

import { AccountType } from '@prisma/client'

import { getUsers, editUser } from '@/services/fetchers-api'

import { getAsyncToast } from '@/utils/get-async-toaster'

import EditUserDialog from '../forms/edit-user/edit-user-dialog'

const DataTableCltWrapper: FC<DataTableCltWrapperProps> = ({ data }) => {
  const [isDialogEditUserOpen, setIsDialogEditUserOpen] = useState(false)
  const [userUnderEdition, setUserUnderEdition] =
    useState<UserWithPOSAndBrands>()

  const { data: users } = useSWRImmutable(
    SWR_KEYS.GET_USERS,
    async () => {
      const users = await getUsers(Object.values(AccountType))
      return users.result
    },
    { fallbackData: data, revalidateOnMount: true }
  )

  const onDeleteUserConfirmation = async (userID: number) => {
    await getAsyncToast(() => deleteUser(userID))
    mutate(SWR_KEYS.GET_USERS)
  }

  // Will open modal
  const onEditUserRequest = (userDataToEdit: UserWithPOSAndBrands) => {
    setIsDialogEditUserOpen(true)
    setUserUnderEdition(userDataToEdit)
  }

  // Query db to update && mutate list of users
  const editUserConfirmationHandler = async (
    editedUserData: Omit<TypeAddEditUser, 'password'>
  ) => {
    setIsDialogEditUserOpen(false)

    console.log(' userUnderEdition?.id', userUnderEdition?.id)
    console.log('editedUserData', editedUserData)
    if (userUnderEdition?.id && editedUserData) {
      await getAsyncToast(() => editUser(userUnderEdition?.id, editedUserData))

      mutate(SWR_KEYS.GET_USERS)
    }
  }

  return (
    <DataTableManageUsers
      columns={columnManageUsers(onDeleteUserConfirmation, onEditUserRequest)}
      data={users ?? []}
    >
      <EditUserDialog
        isOpen={isDialogEditUserOpen}
        userUnderEdition={userUnderEdition}
        onOpenChangeHandler={setIsDialogEditUserOpen}
        editUserConfirmationHandler={editUserConfirmationHandler}
      />
    </DataTableManageUsers>
  )
}

export default DataTableCltWrapper
