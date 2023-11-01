'use client'

import { FC, useState } from 'react'

import { checkIfRefIsInLS, addProductLocalStorage } from '@/utils/local-storage'

interface AlterCartBtn {
  id: number
}

const AlterCartBtn: FC<AlterCartBtn> = ({ id }) => {
  // Checking if item is in LS and define default state
  const [isAlreadyInCart, setIsAlreadyInCart] = useState(checkIfRefIsInLS(id))

  const handlerAlterQty = (operator: '+' | '-') => {
    addProductLocalStorage(id, operator) // alter LS

    setIsAlreadyInCart(checkIfRefIsInLS(id)) // update is in LS
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
