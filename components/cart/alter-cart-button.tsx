'use client'

import { FC } from 'react'

import { mutate } from 'swr'

import {
  getSalesLSInJSObj,
  alterProductLocalStorage,
  specificItemQty,
} from '@/utils/local-storage'

import SWR_KEYS from '@/constants/SWR-keys'
import useSWR from 'swr'

import { Text, Button } from '@radix-ui/themes'

interface AlterCartBtn {
  id: number
  style?: string
}

const AlterCartBtn: FC<AlterCartBtn> = ({ id, style }) => {
  // This fetcher cause cart button to bump on search query deletion
  const {
    data: allSalesInLS,
    error,
    isLoading,
    isValidating,
  } = useSWR(SWR_KEYS.GET_CART_LS, () => getSalesLSInJSObj() ?? [], {
    revalidateOnMount: true,
  })

  const specificItemCount = specificItemQty(allSalesInLS ?? [], id)

  const handlerAlterQty = (operator: '+' | '-') => {
    alterProductLocalStorage(id, operator) // alter LS

    mutate(SWR_KEYS.GET_CART_LS) // for btn alter qty & price calculation in cart
    mutate(SWR_KEYS.GET_CART_PRODUCT_DETAILS) // fetch product details with current cart
  }

  return (
    <div
      className={`flex justify-center items-center gap-x-3 my-1 ${style ?? ''}`}
    >
      <Button
        variant="soft"
        size={'1'}
        disabled={specificItemCount ? false : true}
        className={`${!specificItemCount ? 'invisible' : ''} !h-4`}
        onClick={() => handlerAlterQty('-')}
      >
        -
      </Button>
      <Text weight={'bold'} size={'1'}>
        {specificItemCount ? specificItemCount : ''}
      </Text>

      <Button
        className={`!h-4`}
        variant="soft"
        size={'1'}
        onClick={() => handlerAlterQty('+')}
      >
        +
      </Button>
      {/* 
      <button
        disabled={specificItemCount ? false : true}
        className={!specificItemCount ? 'invisible' : ''}
        onClick={() => handlerAlterQty('-')}
      >
        -
      </button>
      <button onClick={() => handlerAlterQty('+')}>+</button> */}
    </div>
  )
}

export default AlterCartBtn
