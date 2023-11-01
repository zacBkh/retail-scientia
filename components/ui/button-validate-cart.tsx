'use client'

import { FC, useState } from 'react'

import { getSalesLSInJSObj } from '@/utils/local-storage'

import { registerSale } from '@/services/fetchers-api'

interface ButtonProps {
  txt: string
  style: string
  handler?: () => void
}

import { APIAnswer } from '@/types'

const Button: FC<ButtonProps> = ({ txt, style }) => {
  const css = `flex justify-between gap-x-3 items-center px-4 py-[5px] md:py-[10px] $text-center rounded-full font-bold
    ${style}`

  const [feedbackUser, setFeedbackUser] = useState('')

  const handleValidateCart = async () => {
    const finalSales = getSalesLSInJSObj()
    const finalDate = localStorage.getItem('date') as string

    if (!finalDate || !finalSales?.length) {
      console.log('Date or at least a sale is missing')
      setFeedbackUser(
        'You either do not have sales registered or a specific date'
      )
      return
    }

    console.log('finalSales', finalSales)
    console.log('finalDate', finalDate)

    const registrationSale: APIAnswer = await registerSale(
      finalDate,
      finalSales
    )
    setFeedbackUser(registrationSale.result)
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
