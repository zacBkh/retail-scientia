'use client'

import useSwr from 'swr/immutable'
import { mutate } from 'swr'
import SWR_KEYS from '@/constants/SWR-keys'

import { getSalesLSInJSObj } from '@/utils/local-storage'

import { getProductDetails } from '@/services/fetchers-api'

import CartItem from '@/components/cart/cart-item'
import Button from '@/components/ui/button-validate-cart'
import Spinner from '@/components/ui/spinner'
import Loading from '../loading'

const Cart = ({}) => {
  let allSalesInLS = getSalesLSInJSObj() ?? []

  // IS THIS USEFUL ???Update variable that holds the current LS to remove the line in the cart if needed
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
    SWR_KEYS.GET_CART_PRODUCT_DETAILS,
    () => getProductDetails(allSalesInLS),
    {
      revalidateOnMount: true,
    }
  )

  console.log('productDetails', productDetails)

  console.log('isLoading', isLoading)
  console.log('isValidating', isValidating)
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
            onUpdateQty={handleQtyCartChange}
          />
        ))}
        {isValidating ? (
          <Spinner style="border-t-black !w-5 !h-5 mx-auto" />
        ) : (
          ''
        )}
      </div>

      <Button
        style={''}
        txt="Validate your cart"
        onValidateCart={handleQtyCartChange}
      />
    </>
  )
}

export default Cart
