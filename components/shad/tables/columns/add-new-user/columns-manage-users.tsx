'use client'

import { ColumnDef } from '@tanstack/react-table'

import type { UserWithPOSAndBrands } from '@/types'

import { ArrowUpDown } from 'lucide-react'

import { Button } from '@/components/shad/ui/button'

import { MoreHorizontal, UserCog } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/shad/ui/dropdown-menu'
import DialogDeleteUser from '@/components/ui/alert-dialog-delete-user'
import { DialogTrigger } from '@/components/shad/ui/dialog'

interface columnAddUserToPOSTypes {
  (
    onDeleteUserConfirmation: (userID: number) => void,
    onEditUserRequest: (userID: UserWithPOSAndBrands) => void
  ): ColumnDef<UserWithPOSAndBrands>[]
}

export const columnManageUsers: columnAddUserToPOSTypes = (
  onDeleteUserConfirmation,
  onEditUserRequest
) => [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          className="font-semibold"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'pointOfSale.name',
    header: 'Point of Sale',
  },
  {
    accessorKey: 'accountType',
    header: 'Acc. type',
  },
  {
    accessorKey: 'staffID',
    header: 'ID',
  },
  {
    id: 'actions',
    // header: 'Manage',
    header: () => <UserCog className="mx-auto" size={21} />,
    cell: ({ row }) => {
      const user = row.original

      return (
        <DialogDeleteUser
          title="Are you sure?"
          description="You are about to delete a user. This action cannot be undone."
          handlerContinue={() => onDeleteUserConfirmation(user.id)}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem onClick={() => onEditUserRequest(user)}>
                Edit User
              </DropdownMenuItem>
              <DialogTrigger asChild>
                <DropdownMenuItem className="text-red-500">
                  Delete User
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </DialogDeleteUser>
      )
    },
  },
]
