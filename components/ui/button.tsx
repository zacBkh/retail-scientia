'use client'

import { FC } from 'react'

import { getSalesLocalStorage } from '@/utils/local-storage'

import { registerSale } from '@/services/fetchers-api'

interface ButtonProps {
  txt: string
  style: string
  handler?: () => void
}

const handleValidateCart = async () => {
  const finalSales = getSalesLocalStorage()
  const finalDate = localStorage.getItem('date') as string

  console.log('finalSales', finalSales)
  console.log('finalDate', finalDate)

  const combined = { sales: finalSales, date: finalDate }
  await registerSale(finalDate, finalSales)
}

const Button: FC<ButtonProps> = ({ txt, style }) => {
  const css = `flex justify-between gap-x-3 items-center px-4 py-[5px] md:py-[10px] $text-center rounded-full font-bold
    ${style}`

  return (
    <button aria-label={txt} onClick={handleValidateCart}>
      {txt}
    </button>
  )
}

export default Button
