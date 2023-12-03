import { FC, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Select } from '@radix-ui/themes'

import useSWRImmutable from 'swr/immutable'

import COLORS from '@/constants/colors-temp'

import SWR_KEYS from '@/constants/SWR-keys'
import { getUniqueCategories } from '@/services/fetchers-api'

import useAddQueryString from '@/hooks/useAddQueryStrings'
import Spinner from '../spinner'

import type { APIResponseBasic } from '@/types'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface SelectProductLineProps {
  activeLine?: string // move to enum ??

  fetcher: () => Promise<APIResponseBasic<string[]>>
}

const SelectProductLine: FC<SelectProductLineProps> = ({
  fetcher,
  activeLine,
}) => {
  const {
    data: uniqueOptions,
    error,
    isLoading,
  } = useSWRImmutable(SWR_KEYS.GET_UNIQUE_CATEGORY, () => fetcher())

  const [isOpen, setIsOpen] = useState(false)
  const [isPlaceholderMode, setIsPlaceholderMode] = useState(true)

  const selectActiveStyle = '!outline !outline-2 !outline-[#3db9cf]'

  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  const searchParams = useSearchParams()!
  const addQueryString = useAddQueryString(searchParams.toString())

  const handleOptionChange = (newItem: string) => {
    if (newItem === placeholderValue) {
      setIsPlaceholderMode(true)

      router.push(`?${addQueryString('category1', null)}`, {
        scroll: false,
      })
    } else {
      setIsPlaceholderMode(false)

      startTransition(() => {
        router.push(`?${addQueryString('category1', newItem.toLowerCase())}`, {
          scroll: false,
        })
      })
    }
  }

  const cssSelectSkeletonCommon = 'w-1/2'
  const placeholderValue = 'Select any line'

  const optionsWithClear = uniqueOptions && [
    placeholderValue,
    // null as unknown as string,
    ...uniqueOptions?.result,
  ]
  return (
    <>
      {isLoading ? (
        <Skeleton
          height={32}
          className=""
          containerClassName={cssSelectSkeletonCommon}
        />
      ) : (
        <Select.Root
          disabled={isLoading}
          open={isOpen}
          onOpenChange={(prev) => setIsOpen(prev)}
          onValueChange={handleOptionChange}
        >
          <div className="flex items-center gap-x-2 w-full">
            <Select.Trigger
              data-placeholder={isPlaceholderMode ? true : undefined}
              className={`!border-none box !shadow-none ${cssSelectSkeletonCommon} ${
                COLORS.turquoiseLight_bg
              } ${isOpen ? selectActiveStyle : ''} `}
              placeholder={placeholderValue}
            />
            {isPending && (
              <Spinner style="border-gray-400 border-t-black !w-4 !h-4" />
            )}
          </div>
          <Select.Content
            className={`${COLORS.turquoiseLight_bg} !shadow-2xl`}
            position="popper"
          >
            {optionsWithClear?.map((item: string) => (
              <Select.Item key={item} value={item}>
                {item}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      )}
    </>
  )
}

export default SelectProductLine
