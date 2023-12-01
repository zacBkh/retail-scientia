import { FC, useState } from 'react'

import Image from 'next/image'

import type { Product } from '@prisma/client'

import getCloudiImg from '@/utils/transform-cloudi-img'

import AlterCartBtn from '../cart/alter-cart-button'

import { Flex, Text, Box, Separator } from '@radix-ui/themes'

import HeartIcon from '../ui/icons/heart-fav'

import { toggleFavProduct } from '@/services/fetchers-api'

import { toast } from 'react-toastify'

type ProductWithFav = Product & { isFav: boolean }

const ProductCard: FC<ProductWithFav> = ({
  brandId,
  category1,
  category2,
  description,
  ean,
  gender,
  id,
  axis,
  img,
  reference,
  regularPrice,
  size,
  timePeriod,

  isFav,
}) => {
  const [isFavourite, setIsFavourite] = useState(isFav)

  const handleClickToggleFav = async () => {
    setIsFavourite((prev) => !prev)

    const toastId = 'SALES_ALREADY_EXISTING'
    const autoClose = 2500

    toast.success(
      isFav ? 'Removed from favourites.' : 'Adddded to favourites.',
      { toastId, autoClose }
    )

    const mutation = await toggleFavProduct(id, isFavourite)

    if (!mutation.success) {
      return toast.error(mutation.result, { toastId, autoClose })
    }
  }

  return (
    <div className="w-[45vw] sm:w-1/4 lg:w-[17%] 2xl:w-[13%] !shadow px-2 pt-1 border border-[#e5e7eb] border-r relative rounded-lg">
      <Flex align="center" className="!h-[80px]">
        <div className="w-[50%] h-16 relative">
          <Image
            fill
            className="object-contain"
            src={getCloudiImg(undefined, img as string)}
            alt="Product picture"
          />
        </div>
        <Box className="!w-2/3">
          <Text className="!text-xxs" align={'center'} as="div" color="gray">
            {description}
          </Text>
        </Box>
      </Flex>
      <Separator my={'1'} size="4" />
      <AlterCartBtn id={id} />
      <div
        className="absolute top-[-7px] right-[-6px]"
        onClick={handleClickToggleFav}
      >
        <HeartIcon isFav={isFavourite} />
      </div>
    </div>
  )
}

export default ProductCard
