import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shad/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/shad/ui/dropdown-menu'
import { Button } from '@/components/shad/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { ScrollArea } from '@/components/shad/ui/scroll-area'
import EdtiUserForm, {
  TypeEditUserForm,
} from '@/components/forms/edit-user/form-edit-user'
import { UserWithPOSAndBrands } from '@/types'

type Props = {
  user: UserWithPOSAndBrands
  onUserEditConfirm: (id: number, data: TypeEditUserForm) => void
  onUserDeleteConfirm: (id: number) => void
}

enum DialogType {
  EDIT_USER,
  DELETE_USER,
}

export default function ManageUsersActions({
  user,
  onUserEditConfirm,
  onUserDeleteConfirm,
}: Props) {
  const [dialogOpen, setDialogOpen] = useState<DialogType>(DialogType.EDIT_USER)

  const getDialogData = (dialogType: DialogType) => {
    switch (dialogType) {
      case DialogType.DELETE_USER:
        return {
          title: 'Are you sure?',
          description:
            'You are about to delete a user. This action cannot be undone.',
          footer: (
            <DialogFooter>
              <div className="flex gap-x-2 justify-end">
                <DialogClose asChild>
                  <Button size="sm">Cancel</Button>
                </DialogClose>
                <Button
                  size="sm"
                  onClick={() => onUserDeleteConfirm(user.id)}
                  variant="destructive"
                >
                  Delete User
                </Button>
              </div>
            </DialogFooter>
          ),
        }

      case DialogType.EDIT_USER:
        return {
          title: `Edit ${user.name}`,
          description: 'Edit a user in one click',
          content: (
            <ScrollArea className="max-h-[60vh]">
              <EdtiUserForm
                defaultValuesUser={user}
                onConfirmForm={onUserEditConfirm.bind(null, user.id)}
              />
            </ScrollArea>
          ),
        }
    }
  }

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DialogTrigger
            asChild
            onClick={() => setDialogOpen(DialogType.EDIT_USER)}
          >
            <DropdownMenuItem>Edit User</DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger
            asChild
            onClick={() => setDialogOpen(DialogType.DELETE_USER)}
          >
            <DropdownMenuItem className="text-red-500">
              Delete User
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="max-w-[90vw] sm:max-w-[425px]">
        <DialogHeader className="text-left">
          <DialogTitle>{getDialogData(dialogOpen).title}</DialogTitle>
          <DialogDescription className="mt-8">
            {getDialogData(dialogOpen).description}
          </DialogDescription>
        </DialogHeader>
        {getDialogData(dialogOpen).content}
        {getDialogData(dialogOpen).footer}
      </DialogContent>
    </Dialog>
  )
}
