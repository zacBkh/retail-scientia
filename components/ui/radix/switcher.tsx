import { FC, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Text, Switch, Flex } from '@radix-ui/themes'

import useAddQueryString from '@/hooks/useAddQueryStrings'

import { URL_PARAMS_KEYS } from '@/constants/URLs'
const { SHOW_ONLY_FAV } = URL_PARAMS_KEYS

import Spinner from '../spinner'

import COLORS from '@/constants/colors-temp'

interface SwitcherProps {
  disable: boolean
}

const Switcher: FC<SwitcherProps> = ({ disable }) => {
  const searchParams = useSearchParams()!
  const addQueryString = useAddQueryString(searchParams.toString())

  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const handleToggleSwitch = (isChecked: boolean) => {
    if (isChecked) {
      startTransition(() => {
        router.push(`?${addQueryString(SHOW_ONLY_FAV, 'true')}`, {
          scroll: false,
        })
      })
    } else {
      startTransition(() => {
        router.push(`?${addQueryString(SHOW_ONLY_FAV, null)}`, {
          scroll: false,
        })
      })
    }
  }

  return (
    <div className="flex items-center justify-center gap-x-2 w-1/2">
      <Text as="label" size="2">
        <Flex gap="2">
          <Switch
            disabled={disable}
            onCheckedChange={handleToggleSwitch}
            size="1"
            color="violet"
          />
          Favourites only
        </Flex>
      </Text>
      {isPending && (
        <Spinner style="border-gray-400 border-t-black !w-4 !h-4" />
      )}
    </div>
  )
}

export default Switcher
