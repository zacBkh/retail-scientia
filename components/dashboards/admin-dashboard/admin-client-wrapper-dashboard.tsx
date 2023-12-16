import { FC } from 'react'

import type { PointOfSale } from '@prisma/client'

interface AdminDashboardProps {
  allPOS: PointOfSale[] | undefined
}

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/shad/ui/sheet'

const AdminDashboard: FC<AdminDashboardProps> = ({ allPOS }) => {
  return (
    <>
      <Sheet>
        <SheetTrigger className="underline">Open</SheetTrigger>
        <SheetContent side={'left'}>
          <SheetHeader>
            <SheetTitle>Are you sure absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      {allPOS?.map((pos) => (
        <p key={pos.name}>{pos.name}</p>
      ))}
    </>
  )
}

export default AdminDashboard
