import { FC } from 'react'

import type { SalesWithProducts } from '@/types'

import Image from 'next/image'

import getCloudiImg from '@/utils/transform-cloudi-img'

import { Separator } from '@radix-ui/themes'

interface LatestProductSoldItemProps {
  img: string
  desc: string
}

const LatestProductSoldItem: FC<LatestProductSoldItemProps> = ({
  img,
  desc,
}) => {
  return (
    <>
      <div className="h-[44px] flex items-center">
        <div className="flex items-center gap-x-4 w-full">
          <div className="w-[20%]">
            <Image
              width={48}
              height={48}
              src={getCloudiImg(undefined, img)}
              alt="Image of a product"
            />
          </div>

          <div className="w-[80%] h-fit">
            <p className="suspensionPoints w-full block text-sm font-medium ">
              {desc}
            </p>
            <p className="text-[#6c737f] text-xs">Updated 2 days ago</p>
          </div>
        </div>
      </div>
      <Separator size={'4'} />
    </>
  )
}

export default LatestProductSoldItem
