import { REST_API_LINKS } from '@/constants/URLs'
const { SPECIFIC_PRODUCTS, SALE } = REST_API_LINKS

import type { APIAnswerFindProducts, APIRegisterSales } from '@/types'
import type { SalesInLocalStorage } from '@/types'

interface RegisterSalesTypes {
  (date: string, sales: SalesInLocalStorage): Promise<APIRegisterSales>
}

// Add a sale in DB
export const registerSale: RegisterSalesTypes = async (date, productIDs) => {
  const response = await fetch(`${SALE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, productIDs }),
  })
  const data = await response.json()
  return data
}

interface GetProductDetailsArgs {
  (productsIDs: number[]): Promise<APIAnswerFindProducts>
}

import useSWR from 'swr'
import SWR_KEYS from '@/constants/SWR-keys'

import { getSalesLSInJSObj } from '@/utils/local-storage'

// Get specific products details from DB, based on array of IDs
// Used a POST request to pass body
export const getProductDetails: GetProductDetailsArgs = async (productIDs) => {
  let productIDsInLS = getSalesLSInJSObj() ?? []

  const response = await fetch(`${SPECIFIC_PRODUCTS}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productIDsInLS }),
  })
  const data = await response.json()
  console.log('data--->', data)
  return data
}
