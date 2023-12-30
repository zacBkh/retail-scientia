import { getUsersPrisma } from '@/services/prisma-queries'

import { AccountType } from '@prisma/client'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shad/ui/card'

import { Separator } from '@/components/shad/ui/separator'

import AddUserDialog from '@/components/forms/add-user/add-user-dialog'

import DataTableUsers from '@/components/dashboards/data-table-users'

const Dashboard = async () => {
  const allUsers = await getUsersPrisma(Object.values(AccountType))

  return (
    <>
      <Card className="col-span-3">
        <div className="p-2 mb-3">
          <CardHeader>
            <CardTitle>{'Your Users'}</CardTitle>
            <CardDescription>You have {allUsers.length} users.</CardDescription>
            <CardDescription>
              <AddUserDialog />
            </CardDescription>
            <Separator className="w-[90%] mx-auto !mt-3" />

            <DataTableUsers data={allUsers} />
          </CardHeader>
        </div>
      </Card>
    </>
  )
}

export default Dashboard
