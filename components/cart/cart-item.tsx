import { FC } from 'react'

import type { CartItemType } from '@/types'

import Image from 'next/image'

import getCloudiImg from '@/utils/transform-cloudi-img'
import AlterCartBtn from './alter-cart-button'

import SWR_KEYS from '@/constants/SWR-keys'
import useSWR from 'swr'

import { getSalesLSInJSObj, specificItemQty } from '@/utils/local-storage'

const CartItem: FC<CartItemType> = ({
  id,
  description,
  category1,
  img,
  regularPrice,
  size,
}) => {
  const {
    data: allSalesInLS,
    error,
    isLoading,
    isValidating,
  } = useSWR(SWR_KEYS.GET_CART_LS, () => getSalesLSInJSObj() ?? [], {
    revalidateOnMount: true,
  })

  const specificItemCount = specificItemQty(allSalesInLS ?? [], id)
  return (
    <>
      <div className="flex justify-between items-center gap-x-6">
        <div>
          <Image
            src={getCloudiImg(undefined, img as string)}
            alt="Product picture"
            width={50}
            height={75}
            className="bg-[#FAFAFA]"
          />
        </div>

        <div className="flex flex-col gap-y-2 text-xs w-1/2">
          <p className="font-semibold">{category1}</p>
          <div className="flex flex-col">
            <p>{description}</p>
            <p className="text-[#7a7a7a]">{`Size: ${size}`}</p>
          </div>
        </div>

        <div className="border-b border-[#bbb] text-xs w-[15%]">
          <AlterCartBtn style="!text-xs" id={id} />
        </div>

        <div className="text-red-600 text-xs w-[10%]">
          <span>{Math.trunc(specificItemCount * regularPrice)}</span>
        </div>
      </div>
    </>
  )
}

export default CartItem
