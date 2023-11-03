'use client'

import { FC, useState, useEffect } from 'react'

import {
  addProductLocalStorage,
  countOccurenceOfRefInLS,
} from '@/utils/local-storage'

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
  }

  // set current cart qty onLoad
  useEffect(() => {
    setCurrentCartQty(countOccurenceOfRefInLS(id) ?? 0)
  }, [])

  // on load and at any cart qty change, lift the info up for cart component if props passed
  useEffect(() => {
    if (liftQtyUp) {
      liftQtyUp(currentCartQty)
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
