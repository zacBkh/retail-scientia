'use client'

import { FC, useState, useEffect } from 'react'

import type { Session } from 'next-auth'

import SWR_KEYS from '@/constants/SWR-keys'
import useSWR, { mutate } from 'swr'

import { sumSalesValue } from '@/utils/db-data'

import DatePickerDashboard from './date-picker-dashboard'

import { getUserSalesInDB } from '@/services/fetchers-api'

import { dateToStringForQuery } from '@/utils/dates'

import type { DateValueType } from 'react-tailwindcss-datepicker'
import { DateRangeTypeExt, SalesWithProducts } from '@/types'
import { ModeOfProductTable } from '@/constants/db-queries'
import COLORS from '@/constants/colors-temp'

import PieChart from '../charts/pie-chart'

import TableOfSKUs from './latest-product-sold'

import {
  extractUniqueCategoryFromSales,
  combineCategoriesAndSales,
} from '@/utils/business'

import CardHeaderKPIs from './card-kpis-header'

import ShowMoreButtonDashboard from '../ui/button-show-more-dashboard'

import OverlayDarkener from '../ui/overlay-darkener'

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
    () => getUserSalesInDB([datesObject?.startDate, datesObject?.endDate]),
    {
      revalidateOnMount: true,
    }
  )
  const {
    data: filteredSalesUserBySKU,
    error: errorFilteredSalesUserBySKU,
    isLoading: isLoadingFilteredSalesUserBySKU,
    isValidating: isValidatingFilteredSalesUserBySKU,
  } = useSWR(
    SWR_KEYS.GET_SALES_OF_USER_BY_BEST_SELLER_DB,
    () =>
      getUserSalesInDB([datesObject?.startDate, datesObject?.endDate], true),
    {
      revalidateOnMount: true,
    }
  )

  const handleNewDateObject = (newDateObject: DateValueType) => {
    if (newDateObject) {
      setDatesObject(newDateObject as DateRangeTypeExt)
    }
  }

  // If date changed, update the numbers
  useEffect(() => {
    mutate([
      SWR_KEYS.GET_SALES_OF_USER_DB,
      SWR_KEYS.GET_SALES_OF_USER_BY_BEST_SELLER_DB,
    ])
  }, [datesObject?.startDate, datesObject?.endDate])

  const ttlSalesValue =
    filteredSalesUser && sumSalesValue(filteredSalesUser?.result ?? [])

  const uniqueCategories = extractUniqueCategoryFromSales(
    filteredSalesUser?.result ?? []
  )

  const salesByLine = combineCategoriesAndSales(
    uniqueCategories,
    filteredSalesUser?.result ?? []
  )

  const isSalesEmpty = !filteredSalesUser?.result.length

  const [isShowLastSalesExpanded, setIsShowLastSalesExpanded] = useState(false)
  const [isShowTopSellersExpanded, setIsShowTopSellersExpanded] =
    useState(false)

  console.log('filteredSalesUserBySKU', filteredSalesUserBySKU)

  const [isDatePickerOpen, setDatePickerOpen] = useState(false)

  const handleClickOnPage = () => {
    setTimeout(() => {
      const datePickerIsOpen = document.querySelector(
        'div.block.translate-y-0.opacity-1.block'
      )
      if (datePickerIsOpen) {
        setDatePickerOpen(true)
      } else {
        setDatePickerOpen(false)
      }
    }, 50)
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOnPage)

    return () => {
      document.removeEventListener('click', handleClickOnPage)
    }
  }, [])

  return (
    <>
      <OverlayDarkener zIndex="z-[39]" isActive={isDatePickerOpen} />

      <div className={`${COLORS.grey_bg} px-2`}>
        <div className="p-3 ">
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

          {/* LAST SALES */}
          <div
            className={`flex flex-col gap-y-3 py-4 px-4 card-dashboard w-full md:w-1/2`}
          >
            <span className="text-lg font-bold my-2">Latest Sales</span>
            {filteredSalesUser?.result
              ?.slice(0, isShowLastSalesExpanded ? 6 : 3)
              ?.map((item) => (
                <TableOfSKUs
                  mode={ModeOfProductTable.LatestProductsSold}
                  isLoading={isLoading || isValidating}
                  key={item.id}
                  img={item.productSold.img}
                  desc={item.productSold.description}
                  subInfo={item.createdAt}
                />
              ))}
            <ShowMoreButtonDashboard
              isSalesEmpty={isSalesEmpty}
              onToggleBtn={(newState) => setIsShowLastSalesExpanded(newState)}
              isExpandedView={isShowLastSalesExpanded}
            />
          </div>

          {/* TOP SELLERS */}
          <div
            className={` flex flex-col gap-y-3 py-4 px-4 mb-4 card-dashboard w-full md:w-1/2`}
          >
            <span className="text-lg font-bold my-2">Top Sellers</span>
            {filteredSalesUserBySKU?.result
              ?.slice(0, isShowTopSellersExpanded ? 6 : 3)
              ?.map((item) => (
                <TableOfSKUs
                  mode={ModeOfProductTable.TopSellersProducts}
                  isLoading={
                    isLoadingFilteredSalesUserBySKU ||
                    isValidatingFilteredSalesUserBySKU
                  }
                  key={item.id}
                  img={item.productSold.img}
                  desc={item.productSold.description}
                  // @ts-ignore
                  subInfo={item.productSold?.count}
                />
              ))}
            <ShowMoreButtonDashboard
              isSalesEmpty={isSalesEmpty}
              onToggleBtn={(newState) => setIsShowTopSellersExpanded(newState)}
              isExpandedView={isShowTopSellersExpanded}
            />
          </div>
        </div>

        {error ? <p>{error.message || 'An error occured'}</p> : ''}
      </div>
    </>
  )
}

export default DashboardClientWrapper
