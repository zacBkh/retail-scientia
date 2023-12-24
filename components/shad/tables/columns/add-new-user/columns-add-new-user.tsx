'use client'

import { ColumnDef } from '@tanstack/react-table'

import type { UserWithoutPwd } from '@/types'

import { ArrowUpDown, UserPlus } from 'lucide-react'

import { Button } from '@/components/shad/ui/button'

import { MoreHorizontal } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shad/ui/dropdown-menu'

interface columnAddUserToPOSTypes {
  (
    onDeleteUserRequest: (userID: number) => void,
    onEditUserRequest: (userID: number) => void
  ): ColumnDef<UserWithoutPwd>[]
}

export const columnAddNewUser: columnAddUserToPOSTypes = (
  onDeleteUserRequest,
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
    accessorKey: 'staffID',
    header: 'ID',
  },
  {
    id: 'actions',
    header: 'Manage',
    cell: ({ row }) => {
      const user = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onDeleteUserRequest(user.id)}>
              Delete User
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditUserRequest(user.id)}>
              Edit User
            </DropdownMenuItem>
            {/* <DropdownMenuSeparator /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
