import { FC } from 'react'

import Image from 'next/image'

import type { Product } from '@prisma/client'

import getCloudiImg from '@/utils/transform-cloudi-img'

const ProductCard: FC<Product> = ({
  category1,
  category2,
  description,
  ean,
  gender,
  id,
  img,
  isSet,
  reference,
  regularPrice,
  size,
  timePeriod,
}) => {
  return (
    <div
      className="flex max-w-[45vw] justify-between items-center 
      bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <div className="w-1/3 h-20 relative">
        <Image
          fill
          className="object-contain rounded-t-lg"
          src={getCloudiImg(undefined, img)}
          alt=""
        />
      </div>

      <div className="w-2/3 flex flex-col justify-between p-2 leading-normal">
        <p className="text-[10px] text-gray-700 dark:text-gray-400 text-center">
          {description}
        </p>
      </div>
    </div>
  )
}

export default ProductCard
