'use client'

import { FC, useState, useEffect } from 'react'

import { mutate } from 'swr'

import {
  addProductLocalStorage,
  countOccurenceOfRefInLS,
} from '@/utils/local-storage'

import SWR_KEYS from '@/constants/SWR-keys'

interface AlterCartBtn {
  id: number
  style?: string
  liftQtyUp?: (newCartQty: number) => void
}

const AlterCartBtn: FC<AlterCartBtn> = ({ id, style, liftQtyUp }) => {
  const [currentCartQty, setCurrentCartQty] = useState(0)

  const handlerAlterQty = (operator: '+' | '-') => {
    addProductLocalStorage(id, operator) // alter LS
    setCurrentCartQty(countOccurenceOfRefInLS(id) ?? 0) // update qty

    mutate(SWR_KEYS.GET_CART_QTY) // for navbar cart icon
  }

  // set current cart qty onLoad
  useEffect(() => {
    setCurrentCartQty(countOccurenceOfRefInLS(id) ?? 0)
  }, [])

  // On load & at any cart qty change
  useEffect(() => {
    if (liftQtyUp) {
      liftQtyUp(currentCartQty) // lift to cart
      mutate(SWR_KEYS.GET_SOME_PRODUCTS) // mutate cart data
      console.log('6')
    }
  }, [currentCartQty])

  return (
    <div className={`flex items-center gap-x-3 text-sm ${style}`}>
      <button
        disabled={currentCartQty ? false : true}
        className={!currentCartQty ? 'invisible' : ''}
        onClick={() => handlerAlterQty('-')}
      >
        -
      </button>
      <p>{currentCartQty}</p>
      <button onClick={() => handlerAlterQty('+')}>+</button>
    </div>
  )
}

export default AlterCartBtn
