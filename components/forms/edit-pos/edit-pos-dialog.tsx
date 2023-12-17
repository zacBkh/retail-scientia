'use client'

import { FC, useState } from 'react'

import type { User } from '@prisma/client'

interface ButtonCltProps {
  POSId: number
  POSName: string

  usersOfThisPOS?: User[]
}
import { toast } from 'react-toastify'
import { deletePOS } from '@/services/fetchers-api'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shad/ui/dialog'

import { Pencil, Users, Trash2 } from 'lucide-react'

import { Button } from '@/components/shad/ui/button'

import EditUserOfPOS from './edit-user-of-pos'

const EditPOSDialog: FC<ButtonCltProps> = ({
  POSId,
  POSName,
  usersOfThisPOS,
}) => {
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
  const [isAddUserToPOSActive, setIsAddUserToPOSActive] = useState(false)
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger
          className="cursor-pointer"
          onClick={() => setIsDialogOpen(true)}
          asChild
        >
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

          <Button
            className="w-fit"
            size={'sm'}
            onClick={() => setIsAddUserToPOSActive((prev) => !prev)}
          >
            {isAddUserToPOSActive
              ? 'Cancel'
              : 'Add/Remove a user from this POS'}
            <Users strokeWidth={2} className="ml-4" />
          </Button>

          {isAddUserToPOSActive ? (
            <EditUserOfPOS usersOfThisPOS={usersOfThisPOS} />
          ) : (
            ''
          )}

          <Button
            disabled
            variant="destructive"
            className="w-fit"
            size={'sm'}
            onClick={handleDeletePOS}
          >
            Delete POS
            <Trash2 strokeWidth={2} className="ml-4" />
          </Button>

          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EditPOSDialog
