'use client'

import { FC, useState } from 'react'

import { Product } from '@prisma/client'

import ProductCard from '@/components/product/product-card'

import SearchBarMain from '../search-bar'

interface ClientWrapperProps {
  allProducts: Product[]
}

const ClientWrapper: FC<ClientWrapperProps> = ({ allProducts }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = allProducts.filter((sku) =>
    sku.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const productsToDisplay = searchQuery.trim().length
    ? filteredProducts
    : allProducts

  console.log('productsToDisplay[0]', productsToDisplay[0])
  console.log('productsToDisplay[1]', productsToDisplay[1])
  return (
    <>
      <SearchBarMain
        searchQuery={searchQuery}
        onSearch={(query) => setSearchQuery(query)}
      />

      <div className="flex flex-wrap gap-x-1 gap-y-2 justify-between items-center">
        {!productsToDisplay.length ? (
          <span className="px-5 mx-auto text-center">
            Your query does not match any of the products...{' '}
          </span>
        ) : (
          productsToDisplay.map((product) => (
            <ProductCard
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
    </>
  )
}

export default ClientWrapper
