import { FC } from 'react'

import Image from 'next/image'
import getCloudiImg from '@/utils/transform-cloudi-img'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface BrandsDisplayerProps {
  name: string
  pic?: string

  onSelectBrand: (brandName: string) => void
  selectedBrands: string[]

  isLoading: boolean
}

const BrandsDisplayer: FC<BrandsDisplayerProps> = ({
  name,
  pic,

  onSelectBrand,
  selectedBrands,

  isLoading,
}) => {
  const isSelected = selectedBrands.includes(name) || !selectedBrands.length
  return (
    <>
      <button
        onClick={() => onSelectBrand(name)}
        className={`p-2 flex flex-col items-center gap-y-1 transition-all duration-300 text-sm rounded-md w-fit 
        ${
          isSelected ? 'opacity-100 bg-[#DEF7F9]' : 'opacity-25 bg-transparent'
        }`}
      >
        {isLoading ? (
          <Skeleton />
        ) : (
          <Image
            src={getCloudiImg(undefined, pic ?? '')}
            alt="Product picture"
            width={60}
            height={60}
          />
        )}
        {name}
      </button>
    </>
  )
}

export default BrandsDisplayer
