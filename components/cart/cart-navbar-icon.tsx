'use client'

import { useEffect, useState } from 'react'

import { BsCart2 } from 'react-icons/bs'

import useSWR from 'swr'
import { SWR_KEYS } from '@/constants'

import { getSalesLSInJSObj } from '@/utils/local-storage'

const CartNavbarIcon = ({}) => {
  const [isCartBtnAnimated, setIsCartBtnAnimated] = useState(false)

  const {
    data: qty,
    error,
    isLoading,
    isValidating,
  } = useSWR(SWR_KEYS.GET_CART_LS, () => getSalesLSInJSObj() ?? [], {
    revalidateOnMount: true,
  })

  useEffect(() => {
    setIsCartBtnAnimated(true)

    const timer = setTimeout(() => {
      setIsCartBtnAnimated(false)
    }, 250)

    return () => {
      clearTimeout(timer)
    }
  }, [isValidating])

  return (
    <div className={`relative ${isCartBtnAnimated ? 'bump' : ''}`}>
      <BsCart2 className={'text-xl flex items-center'} />
      <div className="bg-red-300 text-white text-xxs w-[14px] h-[14px] flex items-center justify-center rounded-full absolute -top-1 -right-2">
        {qty ? qty.length : 0}
      </div>
    </div>
  )
}

export default CartNavbarIcon
