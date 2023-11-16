'use client'

import { FC, useState, useEffect } from 'react'

import { Flex, Text, Box, Card } from '@radix-ui/themes'

import type { Session } from 'next-auth'
import { SalesWithProducts } from '@/types'

import SWR_KEYS from '@/constants/SWR-keys'
import useSWR, { mutate } from 'swr'

import { sumSalesValue } from '@/utils/db-data'

import DatePickerDashboard from './date-picker-dashboard'

import { filterUserSalesInDB } from '@/services/fetchers-api'

import { dateToStringForQuery, dateStringForQueryToDate } from '@/utils/dates'

import type { DateValueType } from 'react-tailwindcss-datepicker'
import { DateRangeTypeExt } from '@/types'
import PieChart from '../charts/pie-chart'

import COLORS from '@/constants/colors-temp'

import LatestProductSoldItem from './latest-product-sold'

import {
  extractUniqueCategoryFromSales,
  combineCategoriesAndSales,
} from '@/utils/business'

/* CAN BE OPTIMIZED BY PRESERVING NEW DATE AS STATE AND PASS TO filterUserSalesInDB the  new Date in dateToStringForQuery
like this, the display does not have to use dateStringForQueryToDate
*/

interface DashboardClientWrapperProps {
  currentSession: Session | null
  totalSalesOfUser: SalesWithProducts
}

const DashboardClientWrapper: FC<DashboardClientWrapperProps> = ({
  currentSession,
  totalSalesOfUser,
}) => {
  const [datesObject, setDatesObject] = useState({
    startDate: dateToStringForQuery(new Date()),
    endDate: dateToStringForQuery(new Date()),
  })

  const {
    data: filteredSalesUser,
    error,
    isLoading,
    isValidating,
  } = useSWR(
    SWR_KEYS.GET_SALES_OF_USER_DB,
    () => filterUserSalesInDB([datesObject?.startDate, datesObject?.endDate]),
    {
      revalidateOnMount: true,
    }
  )
  const handleNewDateObject = (newDateObject: DateValueType) => {
    if (newDateObject) {
      setDatesObject(newDateObject as DateRangeTypeExt)
    }
  }

  //   If date changed, update the numbers
  useEffect(() => {
    mutate(SWR_KEYS.GET_SALES_OF_USER_DB)
  }, [datesObject?.startDate, datesObject?.endDate])

  const ttlSalesValue = sumSalesValue(filteredSalesUser?.result ?? [])

  console.log('filteredSalesUser', filteredSalesUser)

  // CAN SIMPLIFY BELOW BY HAVING ONLY ONE FX

  const uniqueCategories = extractUniqueCategoryFromSales(
    filteredSalesUser?.result ?? []
  )

  const salesByLine = combineCategoriesAndSales(
    uniqueCategories,
    filteredSalesUser?.result ?? []
  )

  console.log('ttlSalesValue', ttlSalesValue)

  return (
    <div className={`${COLORS.grey_bg} px-2`}>
      <Box p={'3'}>
        <DatePickerDashboard
          datesObject={datesObject}
          onNewDateObject={handleNewDateObject}
        />
        {isLoading || isValidating ? (
          <>
            <p>Loading...</p>
          </>
        ) : (
          ''
        )}
        <Flex justify={'between'} gap={'2'}>
          <Box>
            <Card className="mt-4" variant="classic">
              <Text as="div" size="2" weight="bold">
                Value
              </Text>
              <Text
                className="mx-auto block"
                weight={'bold'}
                align={'center'}
                color="gray"
                size="7"
              >
                {(ttlSalesValue ?? 0) + '$'}
              </Text>
            </Card>
          </Box>
          <Box>
            <Card className="mt-4" variant="classic">
              <Text as="div" size="2" weight="bold">
                Quantity
              </Text>
              <Text
                className="mx-auto block"
                weight={'bold'}
                align={'center'}
                color="gray"
                size="7"
              >
                {(filteredSalesUser?.result.length ?? 0) + 'pcs'}
              </Text>
            </Card>
          </Box>

          <Box>
            <Card className="mt-4" variant="classic">
              <Text as="div" size="2" weight="bold">
                Ranking
              </Text>
              <Text
                className="mx-auto block"
                weight={'bold'}
                align={'center'}
                color="gray"
                size="7"
              >
                #4
              </Text>
            </Card>
          </Box>
        </Flex>
      </Box>

      <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-x-4 gap-y-4 px-2">
        <PieChart salesByLine={salesByLine} />

        <div
          className={`flex flex-col gap-y-3 py-2 px-4 card-dashboard w-full md:w-1/2`}
        >
          <span className="text-lg font-bold my-4">Latest Sales</span>
          {filteredSalesUser?.result?.map((item) => (
            <LatestProductSoldItem
              key={item.id}
              img={item.productSold.img}
              desc={item.productSold.description}
            />
          ))}
        </div>
      </div>
      {error ? <p>{error.message || 'An error occured'}</p> : ''}
    </div>
  )
}

export default DashboardClientWrapper
