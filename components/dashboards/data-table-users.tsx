'use client'

import { FC, useState, useEffect } from 'react'

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

import EditUserDialog from '../forms/edit-user/edit-user-dialog'
import DialogDeleteUser from '../ui/alert-dialog-delete-user'

const DataTableUsers: FC<DataTableUsersProps> = ({ data }) => {
  const [isDialogEditUserOpen, setIsDialogEditUserOpen] = useState(false)
  const [userUnderEdition, setUserUnderEdition] =
    useState<UserWithPOSAndBrands>()

  const [isUderDeletionConfModalOpen, setIsUderDeletionConfModalOpen] =
    useState(false)
  const [userIDToDelete, setUserIDToDelete] = useState<number | null>(null)

  const { data: users } = useSWRImmutable(
    SWR_KEYS.GET_USERS,
    async () => {
      const users = await getUsers(Object.values(AccountType))
      return users.result
    },
    { fallbackData: data, revalidateOnMount: true }
  )

  const onDeleteUserRequest = async (userID: number) => {
    setIsUderDeletionConfModalOpen(true)
    setUserIDToDelete(userID)
  }
  const deleteUserConfirmHandler = async () => {
    if (!userIDToDelete) {
      return
    }
    setIsUderDeletionConfModalOpen(false)
    await getAsyncToast(() => deleteUser(userIDToDelete))
    mutate(SWR_KEYS.GET_USERS)
  }

  // Open user edition modal
  const onEditUserRequest = (userDataToEdit: UserWithPOSAndBrands) => {
    setIsDialogEditUserOpen(true)
    setUserUnderEdition(userDataToEdit)
  }

  // Query db to update && mutate list of users
  const editUserConfirmationHandler = async (
    editedUserData: TypeEditUserForm
  ) => {
    setIsDialogEditUserOpen(false)

    if (userUnderEdition?.id && editedUserData) {
      await getAsyncToast(() => editUser(userUnderEdition?.id, editedUserData))

      mutate(SWR_KEYS.GET_USERS)
    }
  }

  useEffect(() => {
    if (!isUderDeletionConfModalOpen) {
      setUserIDToDelete(null)
    }
  }, [isUderDeletionConfModalOpen])

  return (
    <DataTableManageUsers
      columns={columnManageUsers(onDeleteUserRequest, onEditUserRequest)}
      data={users ?? []}
    >
      <EditUserDialog
        isOpen={isDialogEditUserOpen}
        userUnderEdition={userUnderEdition}
        onOpenChangeHandler={setIsDialogEditUserOpen}
        editUserConfirmationHandler={editUserConfirmationHandler}
      />
      <DialogDeleteUser
        isOpen={isUderDeletionConfModalOpen}
        onOpenChange={setIsUderDeletionConfModalOpen}
        title={'Are you sure?'}
        description="You are about to delete a user. This action cannot be undone."
        handlerContinue={deleteUserConfirmHandler}
        handlerCancel={() => setIsUderDeletionConfModalOpen(false)}
      />
    </DataTableManageUsers>
  )
}

export default DataTableUsers
