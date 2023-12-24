'use client'

import { useState } from 'react'

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
  DialogTrigger,
} from '@/components/shad/ui/dialog'

import NewUserForm from './form-add-user'

import type { TypeAddUser } from './form-add-user'
import { AccountType } from '@prisma/client'

import { ScrollArea } from '@/components/shad/ui/scroll-area'

const AddUserDialog = ({}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // const [isStaff, setIsStaff] = useState(true)

  const router = useRouter()

  // const accTypeSelectionHandler = (accType: AccountType) => {
  //   setIsStaff(accType === AccountType.Staff ? true : false)
  // }

  const handleFormAddedComplete = async (newUser: TypeAddUser) => {
    setIsDialogOpen(false)

    await toast.promise(registerNewUser(newUser), {
      pending: PROMISE_TOAST_WAIT,

      success: {
        render({ data }) {
          return `${data?.result} 👌`
        },
      },

      error: 'There has been an issue, try again later',
    })

    router.refresh()
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger onClick={() => setIsDialogOpen(true)} asChild>
          <Button
            className="p-0 underline hover:bg-transparent h-auto"
            variant="ghost"
          >
            Add a new one <Plus className="ml-1" strokeWidth={2} size={20} />
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-[90vw] sm:max-w-[425px]">
          <DialogHeader className="text-left">
            <DialogTitle>Add a User</DialogTitle>
            <DialogDescription className="mt-8">
              Add a new user to your business in a few clicks.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <NewUserForm onConfirmForm={handleFormAddedComplete} />
          </ScrollArea>

          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddUserDialog
