import { FC } from 'react'

import Image from 'next/image'

import getCloudiImg from '@/utils/transform-cloudi-img'

import { Separator } from '@radix-ui/themes'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

interface LatestProductSoldItemProps {
  img: string | null
  desc: string
  isLoading: boolean
  dateSold: Date
}

const LatestProductSoldItem: FC<LatestProductSoldItemProps> = ({
  img,
  desc,
  isLoading,
  dateSold,
}) => {
  const today = dayjs()
  const saleDate = dayjs(dateSold) // Replace with your actual date
  const timeAgo = saleDate.fromNow()

  return (
    <>
      <div className="h-[44px] flex items-center">
        <div className="flex items-center gap-x-4 w-full">
          <div className="w-[20%]">
            {isLoading ? (
              <Skeleton className="h-[48px]" />
            ) : (
              <Image
                width={48}
                height={48}
                src={getCloudiImg(undefined, img ?? '')}
                alt="Image of a product"
              />
            )}
          </div>

          <div className="w-[80%] h-fit">
            <p className="suspensionPoints w-full block text-sm font-medium ">
              {isLoading ? <Skeleton /> : desc}
            </p>
            <p className="text-[#6c737f] text-xs">
              {isLoading ? <Skeleton className="!w-1/2" /> : timeAgo}{' '}
            </p>
          </div>
        </div>
      </div>
      <Separator size={'4'} />
    </>
  )
}

export default LatestProductSoldItem
