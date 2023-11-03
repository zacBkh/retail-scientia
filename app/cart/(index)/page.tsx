'use client'

import useSwr from 'swr/immutable'
import SWR_KEYS from '@/constants/SWR-keys'

import {
  getSalesLSInJSObj,
  countOccurenceOfRefInLS,
} from '@/utils/local-storage'

import { getProductDetails } from '@/services/fetchers-api'

import CartItem from '@/components/cart/cart-item'

const Cart = ({}) => {
  const allSalesInLS = getSalesLSInJSObj() ?? []

  const {
    data: productDetails,
    error,
    isLoading,
    isValidating,
  } = useSwr(SWR_KEYS.GET_SOME_PRODUCTS, () => getProductDetails(allSalesInLS))

  return (
    <>
      <section className="flex flex-col gap-y-4">
        <div className="flex justify-center flex-wrap gap-y-6 underline">
          CART ITEMS
        </div>

        <div className="flex justify-between text-xs border-b border-black pb-2 mt-2">
          <span className="w-[65%]">Products</span>
          <span className="w-[15%]">Quantity</span>
          <span className="w-[10%]">Price</span>
        </div>

        <div className="flex flex-col gap-y-4">
          {productDetails?.result.map((item) => (
            <CartItem
              key={item.id}
              id={item.id}
              category1={item.category1}
              description={item.description}
              img={item.img}
              regularPrice={item.regularPrice}
              size={item.size}
            />
          ))}
        </div>
      </section>
    </>
  )
}

export default Cart
