import { getUsersPrisma } from '@/services/prisma-queries'

import { ModelItem } from '@/components/dashboards'

import { AccountType } from '@prisma/client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shad/ui/card'

import { Separator } from '@/components/shad/ui/separator'

const Dashboard = async () => {
  const allStaff = await getUsersPrisma([AccountType.Staff])
  return (
    <>
      <Card className="col-span-3">
        <div className="p-4 mb-3">
          <CardHeader>
            <CardTitle>{'Your Staffs'}</CardTitle>
            <CardDescription>
              You have {allStaff.length} staffs.
            </CardDescription>
            <Separator className="w-[90%] mx-auto !mt-3" />
          </CardHeader>
        </div>

        <CardContent>
          {allStaff.map((elem) => (
            <ModelItem
              key={elem.id}
              elemID={elem.id}
              line1={elem.name}
              line2={elem.pointOfSale?.name ?? 'N/A'}
              line3={elem.staffID ?? ''}
            />
          ))}
        </CardContent>
      </Card>
    </>
  )
}

export default Dashboard
