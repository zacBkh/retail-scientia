'use client'

import { FC, useState, useEffect, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import useSWR, { mutate } from 'swr'
import SWR_KEYS from '@/constants/SWR-keys'
const { GET_UNIQUE_CATEGORY, GET_BRANDS_OF_USER, GET_AXIS_OF_USER } = SWR_KEYS

import ProductCard from '@/components/product/product-card'

import SearchBarMainV2 from '../search-bar-v2'

import { getDateLS } from '@/utils/local-storage'

import { checkIfIsUserFav } from '@/utils/business'

import type { ProductsWithFav } from '@/types'
import { useDebounce } from 'use-debounce'

import useAddQueryString from '@/hooks/useAddQueryStrings'

import SelectProductLine from '../ui/radix/select-product-line'
import {
  getUniqueCategories,
  getUniqueBrandsOfUser,
  getUniqueAxisOfUser,
} from '@/services/fetchers-api'

import type { APIResponseBasic } from '@/types'

import { URL_PARAMS_KEYS } from '@/constants/URLs'
const { SEARCH, BRAND, CATEGORY_1, AXIS } = URL_PARAMS_KEYS

import Switcher from '../ui/radix/switcher'

interface ClientWrapperProps {
  fetchedProducts: ProductsWithFav[]
  currentUserID: string | undefined
  arrayOfUsersBrandsID: number[]
}

const ClientWrapper: FC<ClientWrapperProps> = ({
  fetchedProducts,
  currentUserID,
  arrayOfUsersBrandsID,
}) => {
  const {
    data: dateInLS,
    error,
    isLoading,
    isValidating,
  } = useSWR(SWR_KEYS.GET_DATE_LS, () => getDateLS(), {
    revalidateOnMount: true,
  })

  console.log('fetchedProducts MAIN PAGE', fetchedProducts)

  const isDateSet = dateInLS?.length

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery] = useDebounce(searchQuery, 500)

  const router = useRouter()
  const { push } = useRouter()

  const searchParams = useSearchParams()!
  const addQueryString = useAddQueryString(searchParams.toString()) // custom hook that will append additional params

  const [isPending, startTransition] = useTransition()

  // When user type in search bar
  useEffect(() => {
    if (!debouncedQuery) {
      startTransition(() => {
        push(`?${addQueryString(SEARCH, null)}`, { scroll: false }) // remove param
      })
    } else {
      startTransition(() => {
        push(`?${addQueryString(SEARCH, debouncedQuery.toLowerCase())}`, {
          scroll: false,
        })
      })
    }
  }, [debouncedQuery, router])

  const onClickSkuListHandler = () => {
    mutate(SWR_KEYS.GET_DATE_LS)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const [productsToDisplay, setProductsToDisplay] = useState(fetchedProducts)

  // When receive new products
  useEffect(() => {
    setProductsToDisplay(fetchedProducts)
  }, [fetchedProducts])

  const [isSelectOpen, setIsSelectOpen] = useState(false)

  return (
    <div
      onClick={!isDateSet ? onClickSkuListHandler : undefined}
      className={`w-full ${
        !isDateSet ? 'opacity-50 blur-[2px] cursor-not-allowed' : ''
      } flex flex-col gap-y-4`}
    >
      <div className="flex flex-col gap-y-4 searchTools ">
        <SearchBarMainV2
          isDateSet={isDateSet}
          searchQuery={searchQuery}
          onSearch={handleSearch}
          isSearching={isPending}
        />

        <div className="flex flex-wrap gap-y-3 justify-between items-center">
          <SelectProductLine
            SWR_KEY={GET_UNIQUE_CATEGORY}
            fetcher={() => getUniqueCategories(arrayOfUsersBrandsID ?? null)}
            QUERY_STRING_KEY={CATEGORY_1}
            placeholder={'Select a line'}
            onOpenSelect={(isOpen) => setIsSelectOpen(isOpen)}
          />

          <SelectProductLine
            SWR_KEY={GET_BRANDS_OF_USER}
            fetcher={async () =>
              getUniqueBrandsOfUser(currentUserID, true) as Promise<
                APIResponseBasic<string[]>
              >
            }
            QUERY_STRING_KEY={BRAND}
            placeholder={'Select a brand'}
            onOpenSelect={(isOpen) => setIsSelectOpen(isOpen)}
          />
          <SelectProductLine
            SWR_KEY={GET_AXIS_OF_USER}
            fetcher={() => getUniqueAxisOfUser(arrayOfUsersBrandsID ?? null)}
            QUERY_STRING_KEY={AXIS}
            placeholder={'Select an Axis'}
            onOpenSelect={(isOpen) => setIsSelectOpen(isOpen)}
          />

          <Switcher disable={isSelectOpen} />
        </div>
      </div>

      <div
        className={`${
          !isDateSet ? 'pointer-events-none' : ''
        } flex flex-wrap gap-x-2 gap-y-2 justify-between items-center`}
      >
        {productsToDisplay.map((product) => (
          <ProductCard
            isFav={checkIfIsUserFav(
              product.favouritedBy,
              currentUserID ?? null
            )}
            brandId={product.brandId}
            key={product.id}
            ean={product.ean}
            reference={product.reference}
            axis={product.axis}
            description={product.description}
            category1={product.category1}
            category2={product.category2}
            gender={product.gender}
            img={product.img}
            regularPrice={product.regularPrice}
            size={product.size}
            timePeriod={product.timePeriod}
            id={product.id}
          />
        ))}
      </div>
    </div>
  )
}

export default ClientWrapper
