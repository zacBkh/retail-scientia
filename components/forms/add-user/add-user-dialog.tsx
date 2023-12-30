'use client'

import { useState } from 'react'

import { Button } from '@/components/shad/ui/button'
import { Plus } from 'lucide-react'

import { registerNewUser } from '@/services/fetchers-api'

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

import type { TypeAddEditUser } from './form-add-user'

import { ScrollArea } from '@/components/shad/ui/scroll-area'

import { getAsyncToast } from '@/utils/get-async-toaster'

import { mutate } from 'swr'
import { SWR_KEYS } from '@/constants'

const AddUserDialog = ({}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleFormAddedComplete = async (newUser: TypeAddEditUser) => {
    setIsDialogOpen(false)
    await getAsyncToast(() => registerNewUser(newUser))
    mutate(SWR_KEYS.GET_USERS)
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
