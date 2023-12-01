'use client'

import { FC, useState, useEffect, useTransition, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import useSWR, { mutate } from 'swr'
import SWR_KEYS from '@/constants/SWR-keys'

import ProductCard from '@/components/product/product-card'

import SearchBarMainV2 from '../search-bar-v2'

import { getDateLS } from '@/utils/local-storage'

import { checkIfIsUserFav } from '@/utils/business'

import type { ProductsWithFav } from '@/types'
import { useDebounce } from 'use-debounce'

import useAddQueryString from '@/hooks/useAddQueryStrings'

interface ClientWrapperProps {
  fetchedProducts: ProductsWithFav[]
  currentUserID: string | undefined
  // cursor: number
}

const ClientWrapper: FC<ClientWrapperProps> = ({
  fetchedProducts,
  currentUserID,
  // cursor,
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

  useEffect(() => {
    if (!debouncedQuery) {
      startTransition(() => {
        push(`?${addQueryString('search', null)}`, { scroll: false }) // remove param
      })
    } else {
      startTransition(() => {
        push(`?${addQueryString('search', debouncedQuery)}`, { scroll: false })
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

  const [pageCount, setPageCount] = useState(1)

  useEffect(() => {
    if (!pageCount) {
      return
    }

    startTransitionPagination(() => {
      push(`?${addQueryString('page', pageCount.toString())}`, {
        scroll: false,
      })
    })
  }, [pageCount, router])

  const [productsToDisplay, setProductsToDisplay] = useState(fetchedProducts)

  useEffect(() => {
    // If search query or on page 1, replace state
    if (pageCount === 1) {
      return setProductsToDisplay(fetchedProducts)
    }

    // if no search query and not on page 1, append
    if (!searchQuery.length) {
      // if no search query
      return setProductsToDisplay((prev) => [...prev, ...fetchedProducts])
    }
  }, [pageCount, fetchedProducts])

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
            img={
              product.img !== ''
                ? product.img
                : 'fallback_picture/hermes/hermes-logo'
            }
            regularPrice={product.regularPrice}
            size={product.size}
            timePeriod={product.timePeriod}
            id={product.id}
          />
        ))}
      </div>

      {!searchQuery.length ? (
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
