import { FC, useState } from 'react'

import type { CartItemType } from '@/types'

import Image from 'next/image'

import getCloudiImg from '@/utils/transform-cloudi-img'
import AlterCartBtn from './alter-cart-button'

const CartItem: FC<CartItemType> = ({
  id,
  description,
  category1,
  img,
  regularPrice,
  size,
  onUpdateQty,
}) => {
  const [currentQtyInCart, seturrentQtyInCart] = useState(0)

  const handlePassQtyInfoOnAlter = (newCartQty: number) => {
    console.log('newCartQty', newCartQty)
    seturrentQtyInCart(newCartQty)
    onUpdateQty() // to check if an item has to be removed
  }

  return (
    <>
      <div className="flex justify-between items-center gap-x-6">
        <div>
          <Image
            src={getCloudiImg(undefined, img)}
            alt="Product picture"
            width={50}
            height={75}
            className="bg-[#FAFAFA]"
          />
        </div>

        <div className="flex flex-col gap-y-2 text-xs w-1/2">
          <p className="font-semibold">{category1}</p>
          <div>
            <p>{description}</p>
            <p className="text-[#7a7a7a]">{`Size: ${size}ml`}</p>
          </div>
        </div>

        <div className="border-b border-[#bbb] text-xs w-[13%]">
          <AlterCartBtn
            liftQtyUp={handlePassQtyInfoOnAlter}
            style="!text-xs"
            id={id}
          />
        </div>

        <div className="text-red-600 text-xs w-[10%]">
          <span>{Math.trunc(currentQtyInCart * regularPrice)}</span>
        </div>
      </div>
    </>
  )
}

export default CartItem
