'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/shad/ui/button'
import { Plus } from 'lucide-react'

import { addNewPOS } from '@/services/fetchers-api'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shad/ui/dialog'

import NewPOSForm from '@/components/forms/add-pos/form-add-pos'

import type { TypeAddPostData } from '@/components/forms/add-pos/form-add-pos'

import { getAsyncToast } from '@/utils/get-async-toaster'

const AddPOSDialog = ({}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const router = useRouter()

  const handleFormAddedComplete = async (newPOS: TypeAddPostData) => {
    setIsDialogOpen(false)
    await getAsyncToast(() => addNewPOS(newPOS))
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
            <DialogTitle>Add a Point of Sale</DialogTitle>
            <DialogDescription className="mt-8">
              Add a Point Of Sale to your business in a few clicks.
            </DialogDescription>
          </DialogHeader>

          <NewPOSForm onFormAdded={handleFormAddedComplete} />

          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddPOSDialog
