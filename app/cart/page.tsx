'use client'

import SWR_KEYS from '@/constants/SWR-keys'
import useSWR, { mutate } from 'swr'

import { useState } from 'react'

import {
  getSalesLSInJSObj,
  clearLocalStorage,
  getDateLS,
} from '@/utils/local-storage'
import { getProductDetails, registerSale } from '@/services/fetchers-api'

import AlertDialogRx from '@/components/ui/radix/alert-dialog'

import Spinner from '@/components/ui/spinner'

import { toast } from 'react-toastify'

import CartTable from '@/components/cart/cart-table'

import { dateStringForQueryToDate } from '@/utils/dates'
import { sumSalesValueFromProdDetails } from '@/utils/db-data'

const Cart = ({}) => {
  const [disabledValidBtn, setDisabledValidBtn] = useState(false)

  // Get the array of id of product sold from LS -
  const {
    data: allSalesInLS,
    // error,
    // isLoading,
    // isValidating,
  } = useSWR(SWR_KEYS.GET_CART_LS, () => getSalesLSInJSObj() ?? [], {
    revalidateOnMount: true,
  })

  const {
    data: productDetails,
    error,
    isLoading,
    isValidating,
  } = useSWR(SWR_KEYS.GET_CART_PRODUCT_DETAILS_DB, () => getProductDetails(), {
    revalidateOnMount: true,
  })

  const {
    data: dateInLS,
    error: errorGetDateLS,
    isLoading: isLoadingGetDateLS,
    isValidating: isValidatingGetDateLS,
  } = useSWR(SWR_KEYS.GET_DATE_LS, () => getDateLS(), {
    revalidateOnMount: true,
  })

  const ttlCartValue = sumSalesValueFromProdDetails(
    productDetails?.result ?? [],
    allSalesInLS ?? []
  )

  const isCartEmpty = !productDetails?.result?.length

  const hanldeConfirmCart = async () => {
    setDisabledValidBtn(true)

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
      console.log('Sale registered ✅', registrationSale)
      clearLocalStorage()
      mutate(SWR_KEYS.GET_CART_LS)
      mutate(SWR_KEYS.GET_CART_PRODUCT_DETAILS_DB)
      setDisabledValidBtn(false)
    } else {
      console.log('Error in registering the sale ❌', registrationSale)
    }
  }

  return (
    <>
      <CartTable
        allSalesInLS={allSalesInLS ?? []}
        productDetails={productDetails}
        ttlQtyAndValue={{
          ttlQty: allSalesInLS?.length ?? 0,
          ttlValue: ttlCartValue ?? 0,
        }}
      />

      {isValidating ? <Spinner style="border-t-black !w-5 !h-5 mx-auto" /> : ''}

      {isCartEmpty ? (
        <div className="text-center">Your cart is empty... 😭</div>
      ) : (
        <AlertDialogRx
          isDisabled={isLoading || isValidating || disabledValidBtn}
          buttonTriggerTxt="Validate Cart"
          headerTxt="Are you sure?"
          bodyTxt="You are about to validate your cart. No further change can be made to your sales once you validated it."
          bodyTxt2="Please check carefully."
          salesDetails={{
            date: dateStringForQueryToDate(dateInLS ?? ''),
            ttlCartValue: ttlCartValue ?? 0,
            ttlQty: allSalesInLS?.length ?? 0,
          }}
          btnConfirmTxt="Validate Cart"
          onValidateAction={hanldeConfirmCart}
        />
      )}
    </>
  )
}

export default Cart
