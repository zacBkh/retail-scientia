'use client'

import { ColumnDef } from '@tanstack/react-table'

import type { UserWithPOSAndBrands } from '@/types'

import { ArrowUpDown } from 'lucide-react'

import { Button } from '@/components/shad/ui/button'

import { UserCog } from 'lucide-react'
import ManageUsersActions from './manage-users-actions'
import { TypeEditUserForm } from '@/components/forms/edit-user/form-edit-user'

interface columnAddUserToPOSTypes {
  (
    onDeleteUserConfirmation: (userID: number) => void,
    onEditUserConfirmation: (
      userID: number,
      newUserData: TypeEditUserForm
    ) => void
  ): ColumnDef<UserWithPOSAndBrands>[]
}

export const columnManageUsers: columnAddUserToPOSTypes = (
  onDeleteUserConfirmation,
  onEditUserConfirmation
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
    header: () => <UserCog className="mx-auto" size={21} />,
    cell: ({ row }) => {
      const user = row.original

      return (
        <ManageUsersActions
          user={user}
          onUserDeleteConfirm={() => onDeleteUserConfirmation(user.id)}
          onUserEditConfirm={onEditUserConfirmation}
        />
      )
    },
  },
]
