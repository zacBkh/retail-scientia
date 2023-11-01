import { REST_API_LINKS } from '@/constants/URLs'

import { Sale, User } from '@prisma/client'

import type { SalesInLocalStorage } from '@/utils/local-storage'

interface RegisterSaleArgs {
  (date: string, sales: SalesInLocalStorage): any
}

// Add a sale
export const registerSale: RegisterSaleArgs = async (saleDetails) => {
  const response = await fetch(`api${REST_API_LINKS.SALE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(saleDetails),
  })
  const data = await response.json()
  return data
}
