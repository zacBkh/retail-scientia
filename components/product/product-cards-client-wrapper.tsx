'use client'

import { FC, useState, useEffect, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import useSWR, { mutate } from 'swr'
import SWR_KEYS from '@/constants/SWR-keys'
const { GET_UNIQUE_CATEGORY, GET_BRANDS_OF_USER } = SWR_KEYS

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
} from '@/services/fetchers-api'

import { URL_PARAMS_KEYS } from '@/constants/URLs'
const { PAGE, SEARCH, BRANDS_IDS, CATEGORY_1 } = URL_PARAMS_KEYS

import Switcher from '../ui/radix/switcher'
import { Legend } from 'chart.js'

interface ClientWrapperProps {
  fetchedProducts: ProductsWithFav[]
  currentUserID: string | undefined
  arrayOfUsersBrandsID: number[]

  currentPage: number

  shouldReplaceWithFreshDate: boolean

  isPaginationActive: boolean
}

const ClientWrapper: FC<ClientWrapperProps> = ({
  fetchedProducts,
  currentUserID,
  arrayOfUsersBrandsID,

  currentPage,

  shouldReplaceWithFreshDate,

  isPaginationActive,
}) => {
  const {
    data: dateInLS,
    error,
    isLoading,
    isValidating,
  } = useSWR(SWR_KEYS.GET_DATE_LS, () => getDateLS(), {
    revalidateOnMount: true,
  })

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

  const [isPendingPagination, startTransitionPagination] = useTransition()

  const [pageCount, setPageCount] = useState(currentPage ?? 1)

  // Once page count state changed, pass new query string
  useEffect(() => {
    console.log('8 ran =')
    if (!pageCount) {
      return
    }

    startTransitionPagination(() => {
      push(`?${addQueryString(PAGE, pageCount.toString())}`, {
        scroll: false,
      })
    })
  }, [pageCount, router])

  const [productsToDisplay, setProductsToDisplay] = useState(fetchedProducts)

  // When receive new products
  useEffect(() => {
    // If no pagination bcs filter, remove query params
    if (!isPaginationActive) {
      push(`?${addQueryString(PAGE, null)}`, { scroll: false })
    }

    const areProductsTheSame = productsToDisplay == fetchedProducts

    // If we are on page 1 or if current product are same than newly fetched
    if (shouldReplaceWithFreshDate || areProductsTheSame) {
      setProductsToDisplay(fetchedProducts)
    } else {
      setProductsToDisplay((prev) => [...prev, ...fetchedProducts])
    }
  }, [fetchedProducts])

  const [isSelectOpen, setIsSelectOpen] = useState(false)

  return (
    <div
      onClick={!isDateSet ? onClickSkuListHandler : undefined}
      className={`w-full ${
        !isDateSet ? 'opacity-50 blur-[2px] cursor-not-allowed' : ''
      } flex flex-col gap-y-4`}
    >
      <SearchBarMainV2
        isDateSet={isDateSet}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        isSearching={isPending}
      />

      <div className="flex flex-wrap gap-y-2 justify-between items-center">
        <SelectProductLine
          SWR_KEY={GET_UNIQUE_CATEGORY}
          fetcher={() => getUniqueCategories(arrayOfUsersBrandsID ?? null)}
          QUERY_STRING_KEY={CATEGORY_1}
          placeholder={'Select a line'}
          onOpenSelect={(isOpen) => setIsSelectOpen(isOpen)}
        />

        <SelectProductLine
          SWR_KEY={GET_BRANDS_OF_USER}
          fetcher={() => getUniqueBrandsOfUser(currentUserID)}
          QUERY_STRING_KEY={BRANDS_IDS}
          placeholder={'Select a brand'}
          onOpenSelect={(isOpen) => setIsSelectOpen(isOpen)}
        />

        <Switcher disable={isSelectOpen} />
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

      {!searchQuery.length && isPaginationActive ? (
        <button onClick={() => setPageCount((prev) => prev + 1)}>
          Load more
        </button>
      ) : (
        ''
      )}
    </div>
  )
}

export default ClientWrapper
