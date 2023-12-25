import { getUsersPrisma } from '@/services/prisma-queries'

import { AccountType } from '@prisma/client'
const { Admin, Marketing, Sales, Staff, Training } = AccountType

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shad/ui/card'

import { Separator } from '@/components/shad/ui/separator'

import AddUserDialog from '@/components/forms/add-user/add-user-dialog'

import DataTableCltWrapper from '@/components/dashboards/data-table-clt-wrapper'

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

            <DataTableCltWrapper data={allUsers} />
          </CardHeader>
        </div>
      </Card>
    </>
  )
}

export default Dashboard
