'use client'

import { useRouter } from 'next/navigation'

import { FC, useState, useEffect } from 'react'

import type { User } from '@prisma/client'

interface ButtonCltProps {
  POSId: number
  POSName: string

  usersOfThisPOS?: User[]
}
import { toast } from 'react-toastify'
import { deletePOS, editUserPOSRelation } from '@/services/fetchers-api'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shad/ui/dialog'

import { Pencil, UserX, Trash2, UserPlus } from 'lucide-react'

import { Button } from '@/components/shad/ui/button'

import EditUserOfPOS from './edit-user-of-pos'

import { ConnectOrDisconnect } from '@/constants'
const { CONNECT, DISCONNECT } = ConnectOrDisconnect

import { mutate } from 'swr'
import { SWR_KEYS } from '@/constants'

const EditPOSDialog: FC<ButtonCltProps> = ({
  POSId,
  POSName,
  usersOfThisPOS,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [isRemoveUserFromPOSActive, setIsRemoveUserFromPOSActive] =
    useState(false)

  const [isAddUserToPOSActive, setIsAddUserToPOSActive] = useState(false)

  // Reset modal state when close it
  useEffect(() => {
    if (!isDialogOpen) {
      setIsRemoveUserFromPOSActive(false)
      setIsAddUserToPOSActive(false)
    }
  }, [isDialogOpen])

  const router = useRouter()

  const handleDeletePOS = async () => {
    setIsDialogOpen(false)

    await toast.promise(deletePOS(POSId), {
      pending: 'Wait a minute...',

      success: {
        render({ data }) {
          return `${data?.result} 👌`
        },
      },
      error: {
        render({ data }) {
          return `${data}`
        },
      },
    })

    router.refresh()
  }

  const displayElementsStateWise = () => {
    const content = {
      header: 'Edit ',
      subHeader: `You can edit the name, country, add and remove staff or delete ${POSName} from your point of sales.`,
      buttonAction: 'Remove a user from this POS',

      shouldDeletePOSShow:
        isRemoveUserFromPOSActive || isAddUserToPOSActive ? false : true,
    }

    // If remove user to POS active
    if (isRemoveUserFromPOSActive) {
      content.header = 'Remove users from '
      content.subHeader =
        'You are about to disconnect a user from his/her point of sale. This will not delete the user.'
      content.buttonAction = 'Cancel'
      return content
    }

    // If add user to POS active
    if (isAddUserToPOSActive) {
      content.header = 'Add users to '
      content.subHeader =
        'You are about to add a user to a point of sale. This will replace the current POS of the user.'
      content.buttonAction = 'Cancel'
      return content
    }

    return content
  }

  // TO DO close modal, display toaster
  const handleConnectUserToPOS = async (
    mode: ConnectOrDisconnect,
    user: User
  ) => {
    await toast.promise(editUserPOSRelation(POSId, user.id, CONNECT), {
      pending: 'Wait a minute...',

      success: {
        render({ data }) {
          return `${data?.result} 👌`
        },
      },
      error: {
        render({ data }) {
          return `${data}`
        },
      },
    })

    router.refresh()
    mutate(SWR_KEYS.GET_USERS)
  }
  const handleRemoveUserFromPOS = async (
    mode: ConnectOrDisconnect,
    user: User
  ) => {
    console.log('You want to remove user', user)

    await toast.promise(editUserPOSRelation(POSId, user.id, DISCONNECT), {
      pending: 'Wait a minute...',

      success: {
        render({ data }) {
          return `${data?.result} 👌`
        },
      },
      error: {
        render({ data }) {
          return `${data}`
        },
      },
    })
    router.refresh()
    mutate(SWR_KEYS.GET_USERS)
  }

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
              {displayElementsStateWise().header}
              <span className="font-black">{POSName}</span>
            </DialogTitle>
            <DialogDescription className="mt-8">
              {displayElementsStateWise().subHeader}
            </DialogDescription>
          </DialogHeader>

          {/* Add user to POS */}
          {!isRemoveUserFromPOSActive && (
            <Button
              className="w-fit"
              size={'sm'}
              onClick={() => setIsAddUserToPOSActive((prev) => !prev)}
            >
              {isAddUserToPOSActive ? 'Cancel' : 'Add a user to this POS'}
              <UserPlus strokeWidth={2} className="ml-4" />
            </Button>
          )}

          {isAddUserToPOSActive ? (
            <EditUserOfPOS
              mode={CONNECT}
              POSId={POSId}
              onClickActionTable={handleConnectUserToPOS}
            />
          ) : (
            ''
          )}

          {/* Disconnect user from POS */}
          {!isAddUserToPOSActive && (
            <Button
              className="w-fit"
              size={'sm'}
              onClick={() => setIsRemoveUserFromPOSActive((prev) => !prev)}
            >
              {isRemoveUserFromPOSActive
                ? 'Cancel'
                : 'Remove a user from this POS'}

              <UserX strokeWidth={2} className="ml-4" />
            </Button>
          )}

          {isRemoveUserFromPOSActive ? (
            <EditUserOfPOS
              mode={DISCONNECT}
              usersOfThisPOS={usersOfThisPOS}
              POSId={POSId}
              onClickActionTable={handleRemoveUserFromPOS}
            />
          ) : (
            ''
          )}

          {/* Btn Delete */}
          {displayElementsStateWise().shouldDeletePOSShow && (
            <Button
              disabled={!displayElementsStateWise().shouldDeletePOSShow}
              variant="destructive"
              className="w-fit"
              size={'sm'}
              onClick={handleDeletePOS}
            >
              Delete POS
              <Trash2 strokeWidth={2} className="ml-4" />
            </Button>
          )}

          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EditPOSDialog
