'use client'

import SWR_KEYS from '@/constants/SWR-keys'
import useSWR, { mutate } from 'swr'

import { getSalesLSInJSObj, clearLocalStorage } from '@/utils/local-storage'
import { getProductDetails, registerSale } from '@/services/fetchers-api'

import AlertDialogRx from '@/components/ui/radix/alert-dialog'

import Spinner from '@/components/ui/spinner'

import { toast } from 'react-toastify'

import CartTable from '@/components/cart/cart-table'

const Cart = ({}) => {
  // const { data: currentSession, status } = useSession()

  // TODO TO REPLACE BY USESWR ??
  let allSalesInLS = getSalesLSInJSObj() ?? []

  const {
    data: productDetails,
    error,
    isLoading,
    isValidating,
  } = useSWR(
    SWR_KEYS.GET_CART_PRODUCT_DETAILS_DB,
    () => getProductDetails(allSalesInLS),
    {
      revalidateOnMount: true,
    }
  )

  const isCartEmpty = !productDetails?.result?.length

  const hanldeConfirmCart = async () => {
    const finalSales = getSalesLSInJSObj()
    const finalDate = localStorage.getItem('date')

    if (!finalDate || !finalSales?.length) {
      //  ALERT SOMETHING WENT WRONG
      return
    }
    const registrationSale = await toast.promise(
      registerSale(finalDate, finalSales),
      {
        pending: 'Wait a minute...',
        success: 'Your sales have been registered 👌',
        error: 'There has been an issue, try again later',
      }
    )

    if (registrationSale.success) {
      // toast.success('Wow so easy !')
      console.log('Sale registered ✅', registrationSale)
      clearLocalStorage()
      mutate(SWR_KEYS.GET_CART_PRODUCT_DETAILS_DB)
    } else {
      console.log('Error in registering the sale ❌', registrationSale)
    }
  }

  return (
    <>
      {/* {isLoading ? <Loading /> : ''} */}

      <CartTable allSalesInLS={allSalesInLS} productDetails={productDetails} />

      {isValidating ? <Spinner style="border-t-black !w-5 !h-5 mx-auto" /> : ''}

      {isCartEmpty && !isValidating ? (
        <div className="text-center">Your cart is empty</div>
      ) : (
        <AlertDialogRx
          buttonTriggerTxt="Validate Cart"
          headerTxt="Are you sure?"
          bodyTxt="You are about to validate your cart. No further change can be made to your sales once you validated your cart."
          bodyTxt2="Please check carefully."
          btnConfirmTxt="Validate Cart"
          onValidateAction={hanldeConfirmCart}
        />
      )}
    </>
  )
}

export default Cart
