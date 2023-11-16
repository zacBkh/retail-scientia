import { FC } from 'react'

import Image from 'next/image'

import { APIResponseFindProducts } from '@/types'
import getCloudiImg from '@/utils/transform-cloudi-img'
import { specificItemQty } from '@/utils/local-storage'

import AlterCartBtn from './alter-cart-button'

interface CartTableProps {
  productDetails: APIResponseFindProducts | undefined
  allSalesInLS: number[]
}

const CartTable: FC<CartTableProps> = ({ productDetails, allSalesInLS }) => {
  return (
    <>
      <table className="table-auto">
        <thead className="pb-4 text-sm md:text-base">
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
              <td className="pr-2 py-2 flex items-center text-xs md:text-base gap-x-2">
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
    </>
  )
}

export default CartTable
