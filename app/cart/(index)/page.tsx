'use client'

import useSwr from 'swr/immutable'
import SWR_KEYS from '@/constants/SWR-keys'

import { getSalesLSInJSObj } from '@/utils/local-storage'
import { getProductDetails } from '@/services/fetchers-api'

import CartItem from '@/components/cart/cart-item'
import Button from '@/components/ui/button-validate-cart'
import Spinner from '@/components/ui/spinner'
import Loading from '../loading'

import { useSession } from 'next-auth/react'

const Cart = ({}) => {
  const { data: currentSession, status } = useSession()
  console.log('currentSession', currentSession)
  console.log('status', status)

  let allSalesInLS = getSalesLSInJSObj() ?? []

  const {
    data: productDetails,
    error,
    isLoading,
    isValidating,
  } = useSwr(
    SWR_KEYS.GET_CART_PRODUCT_DETAILS,
    () => getProductDetails(allSalesInLS),
    {
      revalidateOnMount: true,
    }
  )

  const isCartEmpty = !productDetails?.result?.length
  return (
    <>
      {isLoading ? <Loading /> : ''}

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
        {isValidating ? (
          <Spinner style="border-t-black !w-5 !h-5 mx-auto" />
        ) : (
          ''
        )}
      </div>

      {isCartEmpty ? (
        <div className="text-center">Your cart is empty</div>
      ) : (
        <Button style={''} txt="Validate your cart" />
      )}
    </>
  )
}

export default Cart
