'use client'

import SWR_KEYS from '@/constants/SWR-keys'
import useSWR, { mutate } from 'swr'

import Image from 'next/image'

import {
  getSalesLSInJSObj,
  specificItemQty,
  clearLocalStorage,
} from '@/utils/local-storage'
import { getProductDetails, registerSale } from '@/services/fetchers-api'

import AlertDialogRx from '@/components/ui/radix/alert-dialog'

import Spinner from '@/components/ui/spinner'
import Loading from './loading'

import { useSession } from 'next-auth/react'

import AlterCartBtn from '@/components/cart/alter-cart-button'

import getCloudiImg from '@/utils/transform-cloudi-img'

import { toast } from 'react-toastify'

const Cart = ({}) => {
  const { data: currentSession, status } = useSession()

  let allSalesInLS = getSalesLSInJSObj() ?? []

  const {
    data: productDetails,
    error,
    isLoading,
    isValidating,
  } = useSWR(
    SWR_KEYS.GET_CART_PRODUCT_DETAILS,
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
      mutate(SWR_KEYS.GET_CART_PRODUCT_DETAILS)
    } else {
      console.log('Error in registering the sale ❌', registrationSale)
    }
  }

  return (
    <>
      {/* {isLoading ? <Loading /> : ''} */}

      <table className="table-auto text-xs">
        <thead className="pb-4">
          <tr className="text-center border-b">
            <th className="w-[55%] pb-2">Product(s)</th>
            <th className="w-[25%] pb-2">Quantity</th>
            <th className="w-[10%] pb-2">Price</th>
          </tr>
          <tr className="h-3"></tr>
        </thead>

        <tbody>
          {productDetails?.result.map((item) => (
            <tr key={item.id}>
              <td className="pr-3 py-2 flex items-center">
                <Image
                  src={getCloudiImg(undefined, item.img as string)}
                  alt="Product picture"
                  width={50}
                  height={75}
                  className="bg-[#FAFAFA]"
                />
                <div className="flex flex-col">
                  <p>{item.description}</p>
                  <p className="text-[#7a7a7a]">{`Size: ${item.size}`}</p>
                </div>
              </td>
              <td className="pr-3">
                <AlterCartBtn style="!text-xs" id={item.id} />
              </td>
              <td className="text-center">
                {Math.trunc(
                  specificItemQty(allSalesInLS ?? [], item.id) *
                    item.regularPrice
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
