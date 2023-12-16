'use client'

import { FC, useState } from 'react'

interface ButtonCltProps {
  POSId: number
  POSName: string
}

import { toast } from 'react-toastify'

import { addNewPOS, deletePOS } from '@/services/fetchers-api'

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

import { Pencil } from 'lucide-react'

const EditPOSDialog: FC<ButtonCltProps> = ({ POSId, POSName }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDeletePOS = async () => {
    setIsDialogOpen(false)

    await toast.promise(deletePOS(POSId), {
      pending: 'Wait a minute...',

      success: {
        render({ data }) {
          return `${data?.result} 👌`
        },
      },

      error: 'There has been an issue, try again later',
    })
  }
  const handleConnectUserToPOS = async () => {
    setIsDialogOpen(false)

    console.log('suce')

    // await toast.promise(deletePOS(POSId), {
    //   pending: 'Wait a minute...',

    //   success: {
    //     render({ data }) {
    //       return `${data?.result} 👌`
    //     },
    //   },

    //   error: 'There has been an issue, try again later',
    // })
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger onClick={() => setIsDialogOpen(true)} asChild>
          <Pencil className="ml-4" size={18} strokeWidth={1} />
        </DialogTrigger>
        <DialogContent className="max-w-[90vw] sm:max-w-[425px]">
          <DialogHeader className="text-left">
            <DialogTitle>
              Edit <span className="font-bold">{POSName}</span>
            </DialogTitle>
            <DialogDescription className="mt-8">
              You can edit the name, country, add and remove staff or delete{' '}
              {POSName} from your point of sales.
            </DialogDescription>
          </DialogHeader>

          <p onClick={handleDeletePOS}>Delete POS</p>
          <p onClick={handleConnectUserToPOS}>Add a user to this POS</p>
          {/* <NewPOSForm onFormAdded={handleFormAddedComplete} /> */}

          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EditPOSDialog
