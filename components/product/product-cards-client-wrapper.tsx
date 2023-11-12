'use client'

import { FC, useState } from 'react'

import { Product } from '@prisma/client'

import useSWR, { mutate } from 'swr'
import SWR_KEYS from '@/constants/SWR-keys'

import ProductCard from '@/components/product/product-card'

import SearchBarMain from '../search-bar'

import { getDateLS } from '@/utils/local-storage'

interface ClientWrapperProps {
  allProducts: Product[]
}

const ClientWrapper: FC<ClientWrapperProps> = ({ allProducts }) => {
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

  const filteredProducts = allProducts.filter((sku) =>
    sku.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const productsToDisplay = searchQuery.trim().length
    ? filteredProducts
    : allProducts

  const onClickSkuListHandler = () => {
    mutate(SWR_KEYS.GET_DATE_LS)
  }

  return (
    <div
      onClick={!isDateSet ? onClickSkuListHandler : undefined}
      className={`${
        !isDateSet ? 'opacity-50 blur-[2px] cursor-not-allowed' : ''
      } flex flex-col gap-y-4`}
    >
      <SearchBarMain
        isDateSet={isDateSet}
        searchQuery={searchQuery}
        onSearch={(query) => setSearchQuery(query)}
      />

      <div
        className={`${
          !isDateSet ? 'pointer-events-none' : ''
        } flex flex-wrap gap-x-2 gap-y-2 justify-between items-center`}
      >
        {!productsToDisplay.length ? (
          <span className="px-5 mx-auto text-center">
            Your query does not match any of the products...{' '}
          </span>
        ) : (
          productsToDisplay.map((product) => (
            <ProductCard
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
          ))
        )}
      </div>
    </div>
  )
}

export default ClientWrapper
