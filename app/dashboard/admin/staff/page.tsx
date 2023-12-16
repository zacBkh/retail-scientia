import { getServerSession } from 'next-auth'
import { authOptions } from '../../../api/auth/[...nextauth]/route'

import { getStaff } from '@/services/prisma-queries'

import { ModelItem } from '@/components/dashboards'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shad/ui/card'

const Dashboard = async () => {
  const allStaff = await getStaff()
  return (
    <>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>{'Your Staff'}</CardTitle>
          <CardDescription>You have {allStaff.length} staff.</CardDescription>
        </CardHeader>
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
