'use client'

import useSwr from 'swr/immutable'

import SWR_KEYS from '@/constants/SWR-keys'

import { getSalesLSInJSObj } from '@/utils/local-storage'

import { getProductDetails } from '@/services/fetchers-api'

import CartItem from '@/components/cart/cart-item'
import Loading from '../loading'

const Cart = ({}) => {
  let allSalesInLS = getSalesLSInJSObj() ?? []

  // Update variable that holds the current LS to remove the line in the cart if needed
  const handleQtyCartChange = () => {
    allSalesInLS = getSalesLSInJSObj() ?? []
  }

  console.log('allSalesInLS', allSalesInLS)

  const {
    data: productDetails,
    error,
    isLoading,
    isValidating,
  } = useSwr(
    SWR_KEYS.GET_SOME_PRODUCTS,
    () => getProductDetails(allSalesInLS),
    {
      revalidateOnMount: true,
    }
  )

  return (
    <>
      {isLoading || isValidating ? <Loading /> : ''}

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
            onQtyAlteration={handleQtyCartChange}
          />
        ))}
      </div>
    </>
  )
}

export default Cart
