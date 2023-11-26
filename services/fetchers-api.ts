import { REST_API_LINKS } from '@/constants/URLs'
const { PRODUCTS, SALE, PRODUCTS_FAV } = REST_API_LINKS

import type {
  APIResponseFindProducts,
  APIResponseRegisterSales,
  SalesInLocalStorage,
  APIResponseFindUserSales,
  APIResponseToggleFav,
} from '@/types'

interface RegisterSalesTypes {
  (date: string, sales: SalesInLocalStorage): Promise<APIResponseRegisterSales>
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
  (): Promise<APIResponseFindProducts>
}

import { getSalesLSInJSObj } from '@/utils/local-storage'

// Get specific products details from DB, based on array of IDs
// Used a POST request to pass body
export const getProductDetails: GetProductDetailsArgs = async () => {
  let productIDsInLS = getSalesLSInJSObj() ?? []

  const response = await fetch(`${PRODUCTS}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productIDsInLS }),
  })
  const data = await response.json()
  return data
}

interface GetFileredUserSalesInDB {
  (
    dateQuery?: string[],
    byTopSeller?: boolean
  ): Promise<APIResponseFindUserSales>
}

// Dashboard - get user sales
export const getUserSalesInDB: GetFileredUserSalesInDB = async (
  datesQuery,
  byTopSeller
) => {
  const response = await fetch(
    `/${SALE}/?dates=${datesQuery}&byTopSeller=${byTopSeller}`,
    {
      method: 'GET',
    }
  )
  const data: APIResponseFindUserSales = await response.json()
  if (!data.success) {
    // @ts-ignore
    const error = new Error(data.result)
    throw error
  }

  return data
}

interface ToggleFavProductArgs {
  (productID: number, isFav: boolean): Promise<APIResponseToggleFav>
}

// Add a sale in DB
export const toggleFavProduct: ToggleFavProductArgs = async (
  productID,
  isFav
) => {
  const response = await fetch(`${PRODUCTS_FAV}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productID, isFav }),
  })
  const data = await response.json()
  return data
}
