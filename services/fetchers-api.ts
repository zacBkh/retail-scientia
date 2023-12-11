import { REST_API_LINKS } from '@/constants/URLs'
const { PRODUCTS, SALE, PRODUCTS_FAV, USERS } = REST_API_LINKS

import { URL_PARAMS_KEYS } from '@/constants/URLs'
const {
  USER_ID,
  BRANDS_IDS,
  BY_TOP_SELLER,
  GET_UNIQUE_CAT,
  GET_UNIQUE_AXIS,
  PRODUCT_ID,
  BRANDS_NAMES,
  BRANDS_NAME_ONLY,
} = URL_PARAMS_KEYS

import type {
  APIResponseFindProducts,
  APIResponseRegisterSales,
  SalesInLocalStorage,
  APIResponseFindUserSales,
  APIResponseToggleFav,
  APIResponseGetFav,
  GetFilteredUserSalesInDB,
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

// Dashboard - get user sales
export const getUserSalesInDB: GetFilteredUserSalesInDB = async (
  datesQuery,
  byTopSeller,
  brandNames
) => {
  const response = await fetch(
    `/${SALE}/?dates=${datesQuery}&${BY_TOP_SELLER}=${byTopSeller}&${BRANDS_NAMES}=${brandNames}`,
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

interface GetFavProductArgs {
  // (productID: number): Promise<APIResponseGetFav>
  (productID: number): Promise<boolean>
}

// Add a sale in DB
export const fetchIsProductFav: GetFavProductArgs = async (productID) => {
  const response = await fetch(`${PRODUCTS_FAV}?${PRODUCT_ID}=${productID}`, {
    method: 'GET',
  })
  const data = await response.json()

  console.log('data favvv', data)
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

import type { APIResponseBasic } from '@/types'

interface GetUniqueBrandsOrAxisOfUserArgs {
  (brandsIDs: number[] | null): Promise<APIResponseBasic<string[]>> // enum of cat ??
}

// Get a unique list of category1
export const getUniqueCategories: GetUniqueBrandsOrAxisOfUserArgs = async (
  brandsIDs
) => {
  if (!brandsIDs || !brandsIDs.length) {
    console.log('Error, no brandsIDs')
    return
  }
  const response = await fetch(
    `${PRODUCTS}?${GET_UNIQUE_CAT}=true&${BRANDS_IDS}=${[brandsIDs]}`,
    {
      method: 'GET',
    }
  )

  const data = await response.json()
  return data
}

export interface GetUniqueBrandsRespFull {
  name: string
  logo: string
  id: string
}

interface GetUniqueBrandsOfUserArgs {
  (userID: string | undefined, brandsNameOnly?: boolean): Promise<
    APIResponseBasic<GetUniqueBrandsRespFull[] | string[]>
  > // enum of brands ??
}

// Get a unique list of brands of a user
export const getUniqueBrandsOfUser: GetUniqueBrandsOfUserArgs = async (
  userID,
  brandsNameOnly
) => {
  if (!userID || !userID.length) {
    console.log('Error, no user ID')
    return
  }
  let link
  if (brandsNameOnly) {
    link = `${USERS}?${USER_ID}=${userID}&${BRANDS_NAME_ONLY}=true`
  } else {
    link = `${USERS}?${USER_ID}=${userID}`
  }
  const response = await fetch(link, {
    method: 'GET',
  })

  const data = await response.json()
  return data
}

// Get a unique list of axis for a given
export const getUniqueAxisOfUser: GetUniqueBrandsOrAxisOfUserArgs = async (
  brandsIDs
) => {
  if (!brandsIDs || !brandsIDs.length) {
    console.log('Error, no brandsIDs')
    return
  }
  const response = await fetch(
    `${PRODUCTS}?${GET_UNIQUE_AXIS}=true&${BRANDS_IDS}=${[brandsIDs]}`,
    {
      method: 'GET',
    }
  )

  const data = await response.json()
  return data
}
