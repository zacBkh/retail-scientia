'use client'

import { FC, useState, useEffect } from 'react'

import type { Session } from 'next-auth'
import { SalesWithProducts } from '@/types'

import SWR_KEYS from '@/constants/SWR-keys'
import useSWR, { mutate } from 'swr'

import { sumSalesValue } from '@/utils/db-data'

import DatePickerDashboard from './date-picker-dashboard'

import { filterUserSalesInDB } from '@/services/fetchers-api'

import { dateToStringForQuery } from '@/utils/dates'

import type { DateValueType } from 'react-tailwindcss-datepicker'
import { DateRangeTypeExt } from '@/types'
import PieChart from '../charts/pie-chart'

import COLORS from '@/constants/colors-temp'

import LatestProductSoldItem from './latest-product-sold'

import { FaLongArrowAltDown } from 'react-icons/fa'

import {
  extractUniqueCategoryFromSales,
  combineCategoriesAndSales,
} from '@/utils/business'

import CardHeaderKPIs from './card-kpis-header'

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

  const uniqueCategories = extractUniqueCategoryFromSales(
    filteredSalesUser?.result ?? []
  )

  const salesByLine = combineCategoriesAndSales(
    uniqueCategories,
    filteredSalesUser?.result ?? []
  )

  console.log('filteredSalesUser', filteredSalesUser)

  const isSalesEmpty = !filteredSalesUser?.result.length

  const [qtyShowPrevSales, setQtyShowPrevSales] = useState(3)

  return (
    <div className={`${COLORS.grey_bg} px-2`}>
      <div className="p-3">
        <DatePickerDashboard
          datesObject={datesObject}
          onNewDateObject={handleNewDateObject}
        />

        <div className="my-3 flex gap-x-3 justify-between">
          <CardHeaderKPIs
            isLoading={isLoading || isValidating}
            text="Value"
            value={(ttlSalesValue ?? 0) + ' $'}
          />
          <CardHeaderKPIs
            isLoading={isLoading || isValidating}
            text="Quantity"
            value={(filteredSalesUser?.result.length ?? 0) + ' pcs'}
          />

          <CardHeaderKPIs
            isLoading={isLoading || isValidating}
            text="Ranking"
            value="#4"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-x-4 gap-y-4 px-2">
        <PieChart
          isLoading={isLoading || isValidating}
          isSalesEmpty={isSalesEmpty}
          salesByLine={salesByLine}
        />

        <div
          className={`flex flex-col gap-y-3 py-4 px-4 mb-4 card-dashboard w-full md:w-1/2`}
        >
          <span className="text-lg font-bold my-2">Latest Sales</span>
          {filteredSalesUser?.result
            ?.slice(0, qtyShowPrevSales)
            ?.map((item) => (
              <LatestProductSoldItem
                isLoading={isLoading || isValidating}
                key={item.id}
                img={item.productSold.img}
                desc={item.productSold.description}
                dateSold={item.createdAt}
              />
            ))}

          {!isSalesEmpty ? (
            <button
              onClick={() =>
                setQtyShowPrevSales(qtyShowPrevSales === 3 ? 6 : 3)
              }
              className="text-sm font-semibold inline-flex justify-end items-center gap-x-2"
            >
              {`View ${qtyShowPrevSales === 3 ? 'more' : 'less'}`}
              <FaLongArrowAltDown
                className={`transition-transform duration-200 ${
                  qtyShowPrevSales === 3 ? 'rotate-0' : '-rotate-180'
                }`}
              />
            </button>
          ) : (
            <p className="block text-center">Not much to show here! 😭</p>
          )}
        </div>
      </div>
      {error ? <p>{error.message || 'An error occured'}</p> : ''}
    </div>
  )
}

export default DashboardClientWrapper
