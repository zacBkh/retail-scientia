'use client'

import { ColumnDef } from '@tanstack/react-table'

import { User } from '@prisma/client'

import { ArrowUpDown, UserPlus } from 'lucide-react'

import { Button } from '@/components/shad/ui/button'

interface columnAddUserToPOSTypes {
  (handleConnectUserToPOS: (user: User) => void): ColumnDef<User>[]
}

export const columnAddUserToPOS: columnAddUserToPOSTypes = (
  handleConnectUserToPOS
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
    accessorKey: 'staffID',
    header: 'ID',
  },
  {
    id: 'actions',
    header: 'Add to POS',
    cell: ({ row }) => {
      const user = row.original

      return (
        <UserPlus
          className="mx-auto cursor-pointer"
          size={15}
          strokeWidth={2}
          onClick={() => handleConnectUserToPOS(user)}
        />
        // <DropdownMenu>
        //   <DropdownMenuTrigger asChild>
        //     <Button variant="ghost" className="h-8 w-8 p-0">
        //       <span className="sr-only">Open menu</span>
        //       <MoreHorizontal className="h-4 w-4" />
        //     </Button>
        //   </DropdownMenuTrigger>
        //   <DropdownMenuContent align="end">
        //     <DropdownMenuLabel>Actions</DropdownMenuLabel>
        //     <DropdownMenuItem
        //       onClick={() => navigator.clipboard.writeText(payment.id)}
        //     >
        //       Copy payment ID
        //     </DropdownMenuItem>
        //     <DropdownMenuSeparator />
        //     <DropdownMenuItem>View customer</DropdownMenuItem>
        //     <DropdownMenuItem>View payment details</DropdownMenuItem>
        //   </DropdownMenuContent>
        // </DropdownMenu>
      )
    },
  },
]
