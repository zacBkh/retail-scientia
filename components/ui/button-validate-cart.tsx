'use client'

import { FC, useState } from 'react'

import { getSalesLSInJSObj, clearLocalStorage } from '@/utils/local-storage'

import { registerSale } from '@/services/fetchers-api'

import { mutate } from 'swr'
import SWR_KEYS from '@/constants/SWR-keys'

interface ButtonProps {
  txt: string
  style: string
  handler?: () => void
  onValidateCart?: () => void
}

const Button: FC<ButtonProps> = ({ txt, style, onValidateCart }) => {
  const css = `flex justify-between gap-x-3 items-center px-4 py-[5px] md:py-[10px] $text-center rounded-full font-bold
    ${style}`

  const [feedbackUser, setFeedbackUser] = useState('')

  const handleValidateCart = async () => {
    const finalSales = getSalesLSInJSObj()
    const finalDate = localStorage.getItem('date')

    if (!finalDate || !finalSales?.length) {
      console.log('Date or at least a sale is missing')
      setFeedbackUser(
        'You either do not have sales registered or a specific date'
      )
      return
    }

    const registrationSale = await registerSale(finalDate, finalSales)

    setFeedbackUser(registrationSale.result)
    console.log('registrationSale done -->', registerSale)

    if (registrationSale.success) {
      clearLocalStorage()
      mutate(SWR_KEYS.GET_TOTAL_CART_QTY) // for navbar cart icon
      mutate(SWR_KEYS.GET_CART_PRODUCT_DETAILS)
    }
  }

  return (
    <>
      <button aria-label={txt} onClick={handleValidateCart}>
        {txt}
      </button>
      <span className="text-xs">{feedbackUser}</span>
    </>
  )
}

export default Button
