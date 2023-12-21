import { FC } from 'react'

import Image from 'next/image'

import type { Product } from '@prisma/client'

import getCloudiImg from '@/utils/transform-cloudi-img'

import AlterCartBtn from '../cart/alter-cart-button'

import { Flex, Text, Box, Separator } from '@radix-ui/themes'

import HeartIcon from '../ui/icons/heart-fav'

import { toggleFavProduct, fetchIsProductFav } from '@/services/fetchers-api'

import { toast } from 'react-toastify'

import { mutate } from 'swr'
import useSWRImmutable from 'swr/immutable'
import { SWR_KEYS } from '@/constants'

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
  currentPrice,
  size,
  timePeriod,
  isFav,
}) => {
  const {
    data: isProductFav,
    error,
    isLoading,
    isValidating,
  } = useSWRImmutable(
    `${SWR_KEYS.GET_FAV_PRODUCTS}_${id}`,
    () => fetchIsProductFav(id) ?? [],
    { fallbackData: isFav }
  )

  const handleClickToggleFav = async () => {
    const toastId = `TOGGLE_FAV - ${isProductFav}`
    const autoClose = 2500

    // Optimistic update
    const optimisticIsFav = !isProductFav
    mutate(
      `${SWR_KEYS.GET_FAV_PRODUCTS}_${id}`,
      toggleFavProduct(id, isProductFav),
      {
        // No need to do a refetch, populate cache with optimisticIsFav
        populateCache() {
          return optimisticIsFav
        },
        revalidate: false,
        optimisticData: optimisticIsFav,
      }
    )

    toast.success(
      isProductFav ? 'Removed from favourites.' : 'Added to favourites.',
      {
        toastId,
        autoClose,
      }
    )
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
        <HeartIcon isFav={isProductFav} />
      </div>
    </div>
  )
}

export default ProductCard
