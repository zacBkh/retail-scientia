'use client'

import { FC } from 'react'

interface ButtonCltProps {
  a?: string
}

import { Button } from '@/components/shad/ui/button'
import { Plus } from 'lucide-react'

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

const AddPOSDialog: FC<ButtonCltProps> = ({}) => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="p-0 underline hover:bg-transparent h-auto"
            variant="ghost"
          >
            Add POS <Plus className="ml-1" strokeWidth={2} size={20} />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[90vw] sm:max-w-[425px]">
          <DialogHeader className="text-left">
            <DialogTitle>Add a Point of Sale</DialogTitle>
            <DialogDescription className="mt-8">
              Add a Point Of Sale to your business in a few clicks.
            </DialogDescription>
          </DialogHeader>

          <NewPOSForm />

          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddPOSDialog
