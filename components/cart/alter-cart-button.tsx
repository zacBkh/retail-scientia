'use client'

import { FC, useEffect } from 'react'

import { mutate } from 'swr'

import {
  getSalesLSInJSObj,
  addProductLocalStorage,
  specificItemQty,
} from '@/utils/local-storage'

import SWR_KEYS from '@/constants/SWR-keys'
import useSWR from 'swr'

interface AlterCartBtn {
  id: number
  style?: string
}

const AlterCartBtn: FC<AlterCartBtn> = ({ id, style }) => {
  console.log('id66', id)
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
    addProductLocalStorage(id, operator) // alter LS

    mutate(SWR_KEYS.GET_CART_LS) // for btn alter qty & price calculation in cart
    mutate(SWR_KEYS.GET_CART_PRODUCT_DETAILS) // fetch product details with current cart
  }

  return (
    <div className={`flex items-center gap-x-3 text-sm ${style}`}>
      <button
        disabled={specificItemCount ? false : true}
        className={!specificItemCount ? 'invisible' : ''}
        onClick={() => handlerAlterQty('-')}
      >
        -
      </button>
      <p>{specificItemCount}</p>
      <button onClick={() => handlerAlterQty('+')}>+</button>
    </div>
  )
}

export default AlterCartBtn
