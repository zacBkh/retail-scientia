import { getPOS } from '@/services/prisma-queries'

import { ModelItem } from '@/components/dashboards'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shad/ui/card'

import AddPOSDialog from '@/components/forms/add-pos/add-pos-dialog'

// import { Button } from '@/components/ui/shad/button'

// import { Plus } from 'lucide-react'

const Dashboard = async () => {
  const allPOS = await getPOS()

  return (
    <>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>{'Your Point of Sales'}</CardTitle>
          <CardDescription>
            You have {allPOS.length} point of sales.
          </CardDescription>
          <CardDescription>
            <AddPOSDialog />
          </CardDescription>
        </CardHeader>

        <CardContent>
          {allPOS.map((elem) => (
            <ModelItem
              key={elem.id}
              line1={elem.name}
              line2={elem.country}
              line3={`${elem.users.length} staff`}
            />
          ))}
        </CardContent>
      </Card>
    </>
  )
}

export default Dashboard
