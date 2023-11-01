import { REST_API_LINKS } from '@/constants/URLs'

import type { SalesInLocalStorage } from '@/utils/local-storage'

interface RegisterSaleArgs {
  (date: string, sales: SalesInLocalStorage): any
}

// Add a sale
export const registerSale: RegisterSaleArgs = async (date, productIDs) => {
  const response = await fetch(`api${REST_API_LINKS.SALE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, productIDs }),
  })
  const data = await response.json()
  return data
}
