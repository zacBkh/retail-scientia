'use client'

import { FC, useState, useEffect } from 'react'

import {
  checkIfRefIsInLS,
  addProductLocalStorage,
  countOccurenceOfRefInLS,
} from '@/utils/local-storage'

interface AlterCartBtn {
  id: number
}

const AlterCartBtn: FC<AlterCartBtn> = ({ id }) => {
  const [currentCartQty, setCurrentCartQty] = useState(0)

  const handlerAlterQty = (operator: '+' | '-') => {
    addProductLocalStorage(id, operator) // alter LS
    setCurrentCartQty(countOccurenceOfRefInLS(id) ?? 0) // update qty
  }

  // set current cart qty onLoad
  useEffect(() => {
    setCurrentCartQty(countOccurenceOfRefInLS(id) ?? 0)
  }, [])

  return (
    <div className="flex items-center gap-x-3">
      <button
        disabled={currentCartQty ? false : true}
        className={!currentCartQty ? 'invisible' : ''}
        onClick={() => handlerAlterQty('-')}
      >
        -
      </button>
      <p className="text-sm">{currentCartQty}</p>
      <button onClick={() => handlerAlterQty('+')}>+</button>
    </div>
  )
}

export default AlterCartBtn
