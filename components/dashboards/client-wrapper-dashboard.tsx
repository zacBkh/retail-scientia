'use client'

import { FC, useState, useEffect } from 'react'

import type { Session } from 'next-auth'

import { mutate } from 'swr'
import useSWRImmutable from 'swr/immutable'

import { sumSalesValue } from '@/utils/db-data'
import {
  extractUniqueCategoryFromSales,
  combineCategoriesAndSales,
} from '@/utils/business'
import { dateToStringForQuery } from '@/utils/dates'

import DatePickerDashboard from './date-picker-dashboard'

import {
  getUserSalesInDB,
  getUniqueBrandsOfUser,
} from '@/services/fetchers-api'

import type { DateValueType } from 'react-tailwindcss-datepicker'
import type { DateRangeTypeExt } from '@/types'

import { ModeOfProductTable, zIndexes, SWR_KEYS } from '@/constants'
import COLORS from '@/constants/colors-temp'

const {
  GET_SALES_OF_USER_DB,
  GET_BRANDS_OF_USER_FULL,
  GET_SALES_OF_USER_BY_BEST_SELLER_DB,
} = SWR_KEYS

import PieChart from '../charts/pie-chart'

import TableOfSKUs from './latest-product-sold'

import CardHeaderKPIs from './card-kpis-header'

import ShowMoreButtonDashboard from '../ui/button-show-more-dashboard'
import OverlayDarkener from '../ui/overlay-darkener'

import useOnDetectDatePickerOpen from '@/hooks/useOnDetectDatePickerOpen'

import CSVExport from '../csv-export/csv-export'
import BrandsDisplayer from '../brands/brands-displayer'

import type { GetUniqueBrandsRespFull } from '@/services/fetchers-api'

interface DashboardClientWrapperProps {
  currentSession: Session | null
}

const DashboardClientWrapper: FC<DashboardClientWrapperProps> = ({
  currentSession,
}) => {
  const [datesObject, setDatesObject] = useState({
    startDate: dateToStringForQuery(new Date()),
    endDate: dateToStringForQuery(new Date()),
  })

  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  const {
    data: filteredSalesUser,
    error,
    isLoading,
    isValidating,
  } = useSWRImmutable(
    GET_SALES_OF_USER_DB,
    () =>
      getUserSalesInDB(
        [datesObject?.startDate, datesObject?.endDate],
        undefined,
        selectedBrands
      ),
    {
      revalidateOnMount: true,
    }
  )

  const {
    data: uniqueBrands,
    error: errorUniqueBrands,
    isLoading: isLoadingUniqueBrands,
    isValidating: isValidatingUniqueBrands,
  } = useSWRImmutable(
    GET_BRANDS_OF_USER_FULL,
    () => getUniqueBrandsOfUser(currentSession?.user.id),
    {
      revalidateOnMount: true,
    }
  )

  // USELESS API NETWORK CALLS !! POTENTIAL TO IMPROVE WITH GROUPBY ORDER BY or distinct ??
  const {
    data: sortedSalesBySKU,
    error: errorortedSalesBySKU,
    isLoading: isLoadingSortedSalesBySKU,
    isValidating: isValidatingSortedSalesBySKU,
  } = useSWRImmutable(
    GET_SALES_OF_USER_BY_BEST_SELLER_DB,
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
    mutate(GET_SALES_OF_USER_BY_BEST_SELLER_DB)
    mutate(GET_SALES_OF_USER_DB)
  }, [datesObject?.startDate, datesObject?.endDate])

  // If brand changed, update sales
  useEffect(() => {
    mutate(GET_SALES_OF_USER_DB)
  }, [selectedBrands])

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
  const [isShowBrandsExpanded, setIsShowBrandsExpanded] = useState(false)

  const isDatePickerOpen = useOnDetectDatePickerOpen()

  const handleSelectBrand = (brandClicked: string) => {
    if (!selectedBrands.includes(brandClicked)) {
      return setSelectedBrands((prev) => [...prev, brandClicked])
    } else {
      const newSelectedBrands = selectedBrands.filter(
        (selectedBrand) => selectedBrand !== brandClicked
      )
      setSelectedBrands(newSelectedBrands)
    }
  }
  return (
    <>
      <OverlayDarkener
        zIndex={zIndexes.OVERLAY_DATEPICKER_DASHBOARD}
        isActive={isDatePickerOpen}
      />

      <div className={`${COLORS.grey_bg} px-2`}>
        <div className="p-3 flex flex-col gap-y-2">
          <div className="flex items-center justify-between gap-x-2">
            <DatePickerDashboard
              datesObject={datesObject}
              onNewDateObject={handleNewDateObject}
            />
            {!isDatePickerOpen ? (
              <CSVExport
                sales={filteredSalesUser?.result}
                userName={currentSession?.user.name}
                dates={datesObject}
              />
            ) : (
              ''
            )}
          </div>

          <div className="flex flex-col items-center gap-y-2">
            <ShowMoreButtonDashboard
              isDataEmpty={!uniqueBrands}
              onToggleBtn={(newState) => setIsShowBrandsExpanded(newState)}
              isExpandedView={isShowBrandsExpanded}
              txt={'Filter Brands'}
              noFallback
            />

            {isShowBrandsExpanded
              ? ((uniqueBrands?.result || []) as GetUniqueBrandsRespFull[]).map(
                  (brand) => (
                    <BrandsDisplayer
                      key={brand.id}
                      name={brand.name}
                      pic={brand.logo}
                      onSelectBrand={handleSelectBrand}
                      selectedBrands={selectedBrands}
                      isLoading={
                        isLoadingUniqueBrands || isValidatingUniqueBrands
                      }
                    />
                  )
                )
              : ''}
          </div>

          <div className="flex gap-x-3 justify-between">
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
            className={`flex flex-col gap-y-3 py-2 px-4 card-dashboard w-full md:w-1/2`}
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
              isDataEmpty={isSalesEmpty}
              onToggleBtn={(newState) => setIsShowLastSalesExpanded(newState)}
              isExpandedView={isShowLastSalesExpanded}
            />
          </div>

          {/* TOP SELLERS */}
          <div
            className={`flex flex-col gap-y-3 py-2 px-4 mb-4 card-dashboard w-full md:w-1/2`}
          >
            <span className="text-lg font-bold my-2">Top Sellers</span>
            {sortedSalesBySKU?.result
              ?.slice(0, isShowTopSellersExpanded ? 6 : 3)
              ?.map((item) => (
                <TableOfSKUs
                  mode={ModeOfProductTable.TopSellersProducts}
                  isLoading={
                    isLoadingSortedSalesBySKU || isValidatingSortedSalesBySKU
                  }
                  key={`${item.productSold.id}-1`}
                  img={item.productSold.img}
                  desc={item.productSold.description}
                  // @ts-ignore
                  subInfo={item.productSold?.count}
                />
              ))}
            <ShowMoreButtonDashboard
              isDataEmpty={isSalesEmpty}
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
