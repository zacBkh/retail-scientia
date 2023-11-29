'use client'

import { FC, useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import useSWR, { mutate } from 'swr'
import SWR_KEYS from '@/constants/SWR-keys'

import ProductCard from '@/components/product/product-card'

import SearchBarMainV2 from '../search-bar-v2'

import { getDateLS } from '@/utils/local-storage'

import { checkIfIsUserFav } from '@/utils/business'

import type { ProductsWithFav } from '@/types'
import { useDebounce } from 'use-debounce'

interface ClientWrapperProps {
  allProducts: ProductsWithFav[]
  currentUserID: string | undefined
}

const ClientWrapper: FC<ClientWrapperProps> = ({
  allProducts,
  currentUserID,
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

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!debouncedQuery) {
      return router.push(`/`)
    } else {
      startTransition(() => {
        router.push(`?search=${debouncedQuery}`)
      })
    }
  }, [debouncedQuery, router])

  const onClickSkuListHandler = () => {
    mutate(SWR_KEYS.GET_DATE_LS)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  console.log('---------isPending--------', isPending)

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
        {allProducts.map((product) => (
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
    </div>
  )
}

export default ClientWrapper
