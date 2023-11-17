import { FC } from 'react'

import Image from 'next/image'

import { APIResponseFindProducts } from '@/types'
import getCloudiImg from '@/utils/transform-cloudi-img'
import { specificItemQty } from '@/utils/local-storage'

import AlterCartBtn from './alter-cart-button'

interface CartTableProps {
  productDetails: APIResponseFindProducts | undefined
  allSalesInLS: number[]
  ttlQtyAndValue: { ttlQty: number; ttlValue: number }
}

const CartTable: FC<CartTableProps> = ({
  productDetails,
  allSalesInLS,
  ttlQtyAndValue,
}) => {
  return (
    <>
      <div className="table-container max-h-[75vh] overflow-y-auto">
        <table className="table-auto w-full">
          <thead className="text-sm md:text-base sticky top-0 bg-white">
            <tr className="text-center addBorderTableAfter">
              <th className="w-[55%] pb-2">Product(s)</th>
              <th className="w-[25%] pb-2">Quantity</th>
              <th className="w-[20%] pb-2">Price</th>
            </tr>
          </thead>

          <tbody>
            {productDetails?.result.map((item) => (
              <tr className="!text-xs md:text-base" key={item.id}>
                <td className="pr-2 py-2 flex items-center gap-x-2">
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
                  <AlterCartBtn id={item.id} />
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

          <tfoot className="sticky bottom-0 bg-white">
            <tr className="addBorderTableBefore text-sm md:text-base font-bold text-center">
              <td className="text-start pt-2">Total</td>
              <td className="pr-3 pt-2">{ttlQtyAndValue.ttlQty}</td>
              <td className="pt-2">{ttlQtyAndValue.ttlValue}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  )
}

export default CartTable
