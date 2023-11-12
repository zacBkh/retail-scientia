'use client'

import { FC, useState, useEffect } from 'react'

import { Flex, Text, Box } from '@radix-ui/themes'

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
    console.log('newDateObject', newDateObject)
    if (newDateObject) {
      setDatesObject(newDateObject as DateRangeTypeExt)
    }
  }

  //   If date changed, update the numbers
  useEffect(() => {
    mutate(SWR_KEYS.GET_SALES_OF_USER_DB)
  }, [datesObject?.startDate, datesObject?.endDate])

  const ttlSalesValue = sumSalesValue(filteredSalesUser?.result ?? [])

  return (
    <>
      <Box p={'3'}>
        <Flex direction={'column'} gap="3">
          <Text>Value: {ttlSalesValue}</Text>
          <Text>Qty: {filteredSalesUser?.result.length}</Text>
        </Flex>
      </Box>
      --------------------
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
          <Flex direction={'column'}>
            <Text as="p" suppressHydrationWarning>
              Start date: {dateStringForQueryToDate(datesObject?.startDate)}
            </Text>
            <Text as="p" suppressHydrationWarning>
              End date: {dateStringForQueryToDate(datesObject?.endDate)}
            </Text>
          </Flex>
        )}
      </Box>
      {error ? <p>{error.message || 'An error occured'}</p> : ''}
    </>
  )
}

export default DashboardClientWrapper
