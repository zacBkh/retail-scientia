'use client'

import { FC, Dispatch, SetStateAction } from 'react'

import { useRouter } from 'next/navigation'

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

import { UserWithPOSAndBrands } from '@/types'

interface EditUserDialogProps {
  isOpen: boolean
  userUnderEdition: UserWithPOSAndBrands | undefined
  onOpenChangeHandler: Dispatch<SetStateAction<boolean>>
  editUserConfirmationHandler: (
    editedUserData: Omit<TypeAddEditUser, 'password'>
  ) => void
}

const EditUserDialog: FC<EditUserDialogProps> = ({
  isOpen,
  userUnderEdition,
  onOpenChangeHandler,
  editUserConfirmationHandler,
}) => {
  const router = useRouter()

  const handleEditUserConfirm = (editedUserData: TypeAddEditUser) => {
    console.log('editedUserData', editedUserData)
    editUserConfirmationHandler(editedUserData)
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
