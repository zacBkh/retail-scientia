import { FC, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Select } from '@radix-ui/themes'

import useSWRImmutable from 'swr/immutable'

import COLORS from '@/constants/colors-temp'

import useAddQueryString from '@/hooks/useAddQueryStrings'
import Spinner from '../spinner'

import type { APIResponseBasic } from '@/types'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface SelectProductLineProps {
  fetcher: () => Promise<APIResponseBasic<string[]>>
  SWR_KEY: string

  QUERY_STRING_KEY: string // enum ??
  placeholder: string

  onOpenSelect: (isOpen: boolean) => void
}

const SelectProductLine: FC<SelectProductLineProps> = ({
  fetcher,
  SWR_KEY,

  QUERY_STRING_KEY,
  placeholder,

  onOpenSelect,
}) => {
  const {
    data: uniqueOptions,
    error,
    isLoading,
  } = useSWRImmutable(SWR_KEY, () => fetcher())

  const [isOpen, setIsOpen] = useState(false)
  const [isPlaceholderMode, setIsPlaceholderMode] = useState(true)

  const selectActiveStyle = '!outline !outline-2 !outline-[#3db9cf]'

  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  const searchParams = useSearchParams()!
  const addQueryString = useAddQueryString(searchParams.toString())

  const handleOptionChangeQueryParams = (newItem: string) => {
    if (newItem === placeholder) {
      setIsPlaceholderMode(true)

      startTransition(() => {
        router.push(`?${addQueryString(QUERY_STRING_KEY, null)}`, {
          scroll: false,
        })
      })
    } else {
      setIsPlaceholderMode(false)

      startTransition(() => {
        router.push(
          `?${addQueryString(QUERY_STRING_KEY, newItem.toLowerCase())}`,
          {
            scroll: false,
          }
        )
      })
    }
  }

  const optionsWithClear = uniqueOptions && [
    placeholder,
    // null as unknown as string,
    ...uniqueOptions?.result,
  ]

  const handleOpenSelect = (isOpen: boolean) => {
    setIsOpen(isOpen)

    // Temporary hack to disable below switcher with a delay - https://github.com/radix-ui/primitives/issues/1658
    setTimeout(() => {
      onOpenSelect(isOpen)
    }, 200)
  }

  return (
    <>
      <Select.Root
        disabled={isLoading}
        open={isOpen}
        onOpenChange={handleOpenSelect}
        onValueChange={handleOptionChangeQueryParams}
      >
        <div className={`flex items-center justify-center gap-x-2 w-1/2`}>
          {isLoading ? (
            <Skeleton height={32} width={135} containerClassName={''} />
          ) : (
            <Select.Trigger
              data-placeholder={isPlaceholderMode ? true : undefined}
              className={`!border-none box !shadow-none w-[85%] ${
                COLORS.turquoiseLight_bg
              } ${isOpen ? selectActiveStyle : ''} `}
              placeholder={placeholder}
            />
          )}
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
    </>
  )
}

export default SelectProductLine
