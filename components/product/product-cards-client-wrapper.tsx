'use client'

import { FC, useState } from 'react'

import { Product } from '@prisma/client'

import ProductCard from '@/components/product/product-card'

import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai'

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

  const handleSearchQuery = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const search = evt.target.value
    setSearchQuery(search)
  }

  return (
    <>
      <div className="relative flex flex-1 justify-center items-center w-full 3xl:justify-center !h-fit">
        <div className="z-50 absolute left-[2%] flex justify-center items-center">
          {searchQuery ? (
            <AiOutlineClose
              className="align-middle text-[#99A1B3] shrink-0 w-[18px]"
              onClick={() => setSearchQuery('')}
            />
          ) : (
            <AiOutlineSearch
              className={`align-middle text-[#99A1B3] shrink-0 w-[18px]`}
            />
          )}
        </div>
        <input
          id="mySearchInput"
          type="search"
          onChange={handleSearchQuery}
          value={searchQuery}
          placeholder={'Start typing a product name'}
          className="p-2 pl-9 flex text-sm w-[100%] relative pr-1 py-1 h-10 outline-none focus:outline-orange-500 items-center text-left bg-gray-100"
        />
      </div>
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
              description={product.description}
              category1={product.category1}
              category2={product.category2}
              gender={product.gender}
              img={product.img}
              isSet={product.isSet}
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
