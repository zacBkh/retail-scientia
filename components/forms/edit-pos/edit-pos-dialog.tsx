'use client'

import { useRouter } from 'next/navigation'
import { FC, useState, useEffect } from 'react'
import { AccountType, type User } from '@prisma/client'
import { Button } from '@/components/shad/ui/button'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shad/ui/dialog'

import { ArrowLeftFromLine, Pencil, Trash2, UserPlus } from 'lucide-react'
import {
  deletePOS,
  editUserPOSRelation,
  getUsers,
} from '@/services/fetchers-api'

import { ConnectOrDisconnect, SWR_KEYS } from '@/constants'
const { CONNECT, DISCONNECT } = ConnectOrDisconnect

import useSwrImmuable, { mutate } from 'swr'
import { UserWithoutPwd } from '@/types'

import { getAsyncToast } from '@/utils/get-async-toaster'

import { DataTableEditUserPOS } from '@/components/shad/tables/tables-wrapper/data-table-edit-user-pos'
import {
  columnRemoveUserFromPOS,
  columnAddUserToPOS,
} from '@/components/shad/tables/columns'

enum EditPosSteps {
  INDEX,
  ADD_USER_TO_POS,
  REMOVE_USER_FROM_POS,
  DELETE_POS,
  CONFIRM,
}

interface ButtonCltProps {
  POSId: number
  POSName: string

  usersOfThisPOS?: User[]
}

export const EditPosDialog: FC<ButtonCltProps> = ({
  POSId,
  POSName,
  usersOfThisPOS,
}) => {
  const [step, setStep] = useState<EditPosSteps>(EditPosSteps.INDEX)

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Reset modal state when close it & mutate users when open it
  useEffect(() => {
    if (!isDialogOpen) {
      setStep(EditPosSteps.INDEX)
    }

    if (isDialogOpen) {
      mutate(SWR_KEYS.GET_USERS)
    }
  }, [isDialogOpen])

  const router = useRouter()

  const handleDeletePOS = async () => {
    setIsDialogOpen(false)
    await getAsyncToast(() => deletePOS(POSId))
    router.refresh()
  }

  const handleConnectUserToPOS = async (user: UserWithoutPwd) => {
    setIsDialogOpen(false)

    await getAsyncToast(() => editUserPOSRelation(POSId, user.id, CONNECT))
    router.refresh()
    mutate(SWR_KEYS.GET_USERS)
  }

  const handleRemoveUserFromPOS = async (userToRemove: UserWithoutPwd) => {
    setIsDialogOpen(false)

    await getAsyncToast(() =>
      editUserPOSRelation(POSId, userToRemove.id, DISCONNECT)
    )
    router.refresh()
    mutate(SWR_KEYS.GET_USERS)
  }

  const {
    data: usersNotFromThisPOS,
    error,
    isLoading,
    isValidating,
  } = useSwrImmuable(
    step === EditPosSteps.ADD_USER_TO_POS ? SWR_KEYS.GET_USERS : null,
    () => getUsers([AccountType.Staff], POSId),
    {
      revalidateOnMount: true,
    }
  )

  const CancelBtn = (
    <Button
      onClick={() => setStep(EditPosSteps.INDEX)}
      className="w-fit"
      size={'sm'}
    >
      <ArrowLeftFromLine strokeWidth={2} className="mr-4" />
      Cancel
    </Button>
  )

  const view_mapper = {
    [EditPosSteps.INDEX]: {
      title: `Edit ${POSName}`,
      description: (
        <>
          <span className="block">
            Change the name, or the country of the POS.
          </span>
          <span className="block">Add and remove staff.</span>
          <span className="block">
            Delete {POSName} from your point of sales.
          </span>
        </>
      ),
      children: (
        <>
          <Button
            onClick={() => setStep(EditPosSteps.ADD_USER_TO_POS)}
            className="w-fit"
            size={'sm'}
          >
            Add a user to this POS
            <UserPlus strokeWidth={2} className="ml-4" />
          </Button>

          <Button
            onClick={() => setStep(EditPosSteps.REMOVE_USER_FROM_POS)}
            className="w-fit"
            size={'sm'}
          >
            Remove a user from this POS
            <UserPlus strokeWidth={2} className="ml-4" />
          </Button>

          <Button
            variant="destructive"
            className="w-fit"
            size={'sm'}
            onClick={handleDeletePOS}
          >
            Delete POS
            <Trash2 strokeWidth={2} className="ml-4" />
          </Button>
        </>
      ),
    },

    [EditPosSteps.ADD_USER_TO_POS]: {
      title: `Add users to ${POSName}`,
      description: (
        <>
          <span>You are about to add a user to ${POSName}.</span>
          <span>This will replace the current POS of the user.</span>
        </>
      ),
      children: (
        <>
          {CancelBtn}

          <DataTableEditUserPOS
            isLoading={isLoading || isValidating}
            columns={columnAddUserToPOS(handleConnectUserToPOS)}
            data={usersNotFromThisPOS?.result ?? []}
          />
        </>
      ),
    },

    [EditPosSteps.REMOVE_USER_FROM_POS]: {
      title: 'Edit this POS',
      description:
        'You can edit the name, country, add and remove staff or delete dadadzd from your point of sales.',
      children: (
        <>
          {CancelBtn}

          <DataTableEditUserPOS
            columns={columnRemoveUserFromPOS(handleRemoveUserFromPOS)}
            data={usersOfThisPOS ?? []}
          />
        </>
      ),
    },

    [EditPosSteps.DELETE_POS]: {
      title: 'Edit this POS',
      description:
        'You can edit the name, country, add and remove staff or delete dadadzd from your point of sales.',
      children: (
        <>
          <Button onClick={() => setStep(EditPosSteps.CONFIRM)}>
            Tu confirmes fdp?
          </Button>
        </>
      ),
    },

    [EditPosSteps.CONFIRM]: {
      title: 'Edit this POS',
      description:
        'You can edit the name, country, add and remove staff or delete dadadzd from your point of sales.',
      children: (
        <>
          <Button>Add a user to this POS</Button>
          <Button>Remove a user from this POS</Button>
          <Button>Delete POS</Button>
        </>
      ),
    },
  }

  return (
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
          <DialogTitle>{view_mapper[step].title}</DialogTitle>
          <DialogDescription className="mt-8">
            {view_mapper[step].description}
          </DialogDescription>
        </DialogHeader>
        {view_mapper[step].children}
      </DialogContent>
    </Dialog>
  )
}
