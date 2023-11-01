'use client'

import { FC, useState } from 'react'

import {
  getSalesLocalStorage,
  addProductLocalStorage,
  checkIfRefIsInLS,
} from '@/utils/local-storage'

interface AlterCartBtn {
  reference: string
}

const AlterCartBtn: FC<AlterCartBtn> = ({ reference }) => {
  // Checking if item is in LS and define default state
  const [isAlreadyInCart, setIsAlreadyInCart] = useState(
    checkIfRefIsInLS(reference)
  )

  const handlerAlterQty = (operator: '+' | '-') => {
    addProductLocalStorage(reference, operator) // alter LS

    setIsAlreadyInCart(checkIfRefIsInLS(reference)) // update is in LS
  }

  return (
    <div className="flex items-center gap-x-3">
      <button
        disabled={!isAlreadyInCart}
        className={!isAlreadyInCart ? 'invisible' : ''}
        onClick={() => handlerAlterQty('-')}
      >
        -
      </button>
      <p className="text-sm">5</p>
      <button onClick={() => handlerAlterQty('+')}>+</button>
    </div>
  )
}

export default AlterCartBtn
