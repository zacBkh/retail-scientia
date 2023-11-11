import { FC } from 'react'

import Image from 'next/image'

import type { Product } from '@prisma/client'

import getCloudiImg from '@/utils/transform-cloudi-img'

import AlterCartBtn from '../cart/alter-cart-button'

import { Card, Flex, Text, Box, Inset, Separator } from '@radix-ui/themes'

const ProductCard: FC<Product> = ({
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
}) => {
  return (
    <Card className="!max-w-[45vw] !shadow">
      <Inset side={'y'}>
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
            {/* <Text as="div" size="2" weight="bold"></Text> */}
            <Text className="!text-xxs" align={'center'} as="div" color="gray">
              {description}
            </Text>
            {/* <Text as="div" size="1" color="gray">
            {size}
          </Text> */}
          </Box>
        </Flex>
        <Separator my={'1'} size="4" />
        <AlterCartBtn id={id} />
      </Inset>
    </Card>

    // <div className="flex flex-col items-center border-gray-200 rounded-lg shadow max-w-[45vw] bg-white border">
    //   <div className="flex justify-between items-center">
    //     <div className="w-1/3 h-20 relative">
    //       <Image
    //         fill
    //         className="object-contain rounded-t-lg"
    //         src={getCloudiImg(undefined, img as string)}
    //         alt=""
    //       />
    //     </div>

    //     <div className="w-2/3 flex flex-col justify-between p-2 leading-normal">
    //       <p className="text-[10px] text-gray-700 dark:text-gray-400 text-center">
    //         {description}
    //       </p>
    //     </div>
    //   </div>
    //   <AlterCartBtn id={id} />
    // </div>
  )
}

export default ProductCard
