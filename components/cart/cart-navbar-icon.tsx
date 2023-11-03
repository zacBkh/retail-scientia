'use client'

import { BsCart2 } from 'react-icons/bs'

import { useEffect, useState } from 'react'

// interface propsType{
//   :
// }

import { getSalesLSInJSObj } from '@/utils/local-storage'

const CartNavbarIcon = ({}) => {
  const [cartQty, setCartQty] = useState(0)

  useEffect(() => {
    setCartQty(getSalesLSInJSObj()?.length ?? 0)
  }, [])

  return (
    <div className="relative">
      <BsCart2 className={'text-xl flex items-center'} />
      <div className="bg-red-300 text-white text-xxs w-[14px] h-[14px] flex items-center justify-center rounded-full absolute -top-1 -right-2">
        {cartQty}
      </div>
    </div>
  )
}

export default CartNavbarIcon
