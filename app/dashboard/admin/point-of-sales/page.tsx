import { getPOS } from '@/services/prisma-queries'

import { ModelItem } from '@/components/dashboards'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shad/ui/card'

import { Separator } from '@/components/shad/ui/separator'

import AddPOSDialog from '@/components/forms/add-pos/add-pos-dialog'

import { getCountryDetails } from '@/utils/countries'

const Dashboard = async () => {
  const allPOS = await getPOS()
  return (
    <>
      <Card className="col-span-3">
        <div className="p-4 mb-3">
          <CardHeader>
            <CardTitle>{'Your Point of Sales'}</CardTitle>
            <CardDescription>
              You have {allPOS.length} point of sales.
            </CardDescription>
            <CardDescription>
              <AddPOSDialog />
            </CardDescription>
            <Separator className="w-[90%] mx-auto !mt-3" />
          </CardHeader>
        </div>

        <CardContent>
          {allPOS.map((elem) => (
            <ModelItem
              key={elem.id}
              elemID={elem.id}
              line1={elem.name}
              line2={getCountryDetails(elem.country)?.name ?? ''}
              line3={`${elem.users.length} staff`}
              list={elem.users} // list of staff of this POS
            />
          ))}
        </CardContent>
      </Card>
    </>
  )
}

export default Dashboard
