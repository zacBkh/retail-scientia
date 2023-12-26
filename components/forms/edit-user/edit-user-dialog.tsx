'use client'

import { useState, FC, Dispatch, SetStateAction } from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/shad/ui/button'
import { Plus } from 'lucide-react'

import { toast } from 'react-toastify'

import { registerNewUser } from '@/services/fetchers-api'

import { PROMISE_TOAST_WAIT } from '@/constants'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shad/ui/dialog'

import EdtiUserForm from './form-edit-user'

import type { TypeAddEditUser } from './form-edit-user'

import { ScrollArea } from '@/components/shad/ui/scroll-area'

import { getAsyncToast } from '@/utils/get-async-toaster'

import { editUser } from '@/services/fetchers-api'
import { UserWithoutPwd } from '@/types'

interface EditUserDialogProps {
  isOpen: boolean
  userUnderEdition: UserWithoutPwd | undefined
  onOpenChangeHandler: Dispatch<SetStateAction<boolean>>
}

const EditUserDialog: FC<EditUserDialogProps> = ({
  isOpen,
  userUnderEdition,
  onOpenChangeHandler,
}) => {
  const router = useRouter()

  const handleEditUserConfirm = async (editedUserData: TypeAddEditUser) => {
    console.log(' userUnderEdition?.id', userUnderEdition?.id)
    console.log('editedUserData', editedUserData)
    // const a = editUser(editedUserID, editedUserData)
    // await getAsyncToast(() => registerNewUser(newUser))
    // router.refresh()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChangeHandler}>
        <DialogContent className="max-w-[90vw] sm:max-w-[425px]">
          <DialogHeader className="text-left">
            <DialogTitle>Edit {userUnderEdition?.name}</DialogTitle>
            <DialogDescription className="mt-8">
              Edit a user in one click.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <EdtiUserForm
              defaultValuesUser={userUnderEdition}
              onConfirmForm={handleEditUserConfirm}
            />
          </ScrollArea>

          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EditUserDialog
