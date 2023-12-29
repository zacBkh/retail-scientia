import {
  URL_PARAMS_KEYS,
  REST_API_LINKS,
  ConnectOrDisconnect,
} from '@/constants'
const {
  USER_ID,
  BRANDS_IDS,
  BY_TOP_SELLER,
  GET_UNIQUE_CAT,
  GET_UNIQUE_AXIS,
  PRODUCT_ID,
  BRANDS_NAMES,
  BRANDS_NAME_ONLY,
  POS_TO_DELETE,
  ACCOUNT_TYPE,
  POS_TO_EXCLUDE,
  USER_TO_DELETE,
} = URL_PARAMS_KEYS

const { PRODUCTS, SALE, PRODUCTS_FAV, USERS, USERS_WO_PATH, POINT_OF_SALE } =
  REST_API_LINKS

import type {
  APIResponseFindProducts,
  APIResponseRegisterSales,
  SalesInLocalStorage,
  APIResponseFindUserSales,
  APIResponseToggleFav,
  APIResponseGetFav,
  GetFilteredUserSalesInDB,
  UserWithBrands,
  UserWithPOSAndBrands,
} from '@/types'

import { getSalesLSInJSObj } from '@/utils/local-storage'
import type { AccountType, PointOfSale, User } from '@prisma/client'

import { TypeAddEditUser } from '@/components/forms/add-user/form-add-user'

import type { TypeEditUserForm } from '@/components/forms/edit-user/form-edit-user'

interface RegisterSalesTypes {
  (date: string, sales: SalesInLocalStorage): Promise<APIResponseRegisterSales>
}

/*SC Sale */

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

/* !SC */

/*SC Products */

interface GetProductDetailsArgs {
  (): Promise<APIResponseFindProducts>
}

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

/* !SC */

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
  id: number
}

interface GetUniqueBrandsOfUserArgs {
  (userID: string | undefined, brandsNameOnly?: boolean): Promise<
    APIResponseBasic<GetUniqueBrandsRespFull[] | string[]>
  >
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

interface AddNewPOSArgs {
  (formData: { name: string; country: string }): Promise<
    APIResponseBasic<string>
  >
}

/*SC POS */

export const getPOS: GetUserType = async () => {
  const response = await fetch(`${POINT_OF_SALE}`, {
    method: 'GET',
  })

  const data = await response.json()
  return data
}

export const addNewPOS: AddNewPOSArgs = async (formData) => {
  const response = await fetch(`${POINT_OF_SALE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
  const data = await response.json()
  return data
}

interface DeletePOSType {
  (POSId: number): Promise<APIResponseBasic<string>>
}

export const deletePOS: DeletePOSType = async (POSId) => {
  const response = await fetch(`${POINT_OF_SALE}?${POS_TO_DELETE}=${POSId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })

  const deletedPOS: APIResponseBasic<string> = await response.json()

  if (!deletedPOS.success) {
    return Promise.reject(deletedPOS.result)
  } else {
    return deletedPOS
  }
}

export interface UpdatePOSTypes {
  (
    posID: number,
    userID: number,
    connectOrDisconnect: ConnectOrDisconnect
  ): Promise<APIResponseBasic<string>>
}

export const editUserPOSRelation: UpdatePOSTypes = async (
  posID,
  userID,
  connectOrDisconnect
) => {
  const response = await fetch(`${POINT_OF_SALE}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ posID, userID, connectOrDisconnect }),
  })
  const data = await response.json()
  return data
}

/* !SC */

/*SC USERS */
interface GetUserType {
  (
    accTypesToInclude?: AccountType[],
    posToExclude?: PointOfSale['id']
  ): Promise<APIResponseBasic<UserWithPOSAndBrands[]>>
}

// Get all users
export const getUsers: GetUserType = async (
  accTypesToInclude,
  posToExclude
) => {
  const response = await fetch(
    `${USERS_WO_PATH}?${ACCOUNT_TYPE}=${accTypesToInclude}&${POS_TO_EXCLUDE}=${posToExclude}`,
    {
      method: 'GET',
    }
  )

  const data = await response.json()
  return data
}

interface RegisterNewUserTypes {
  (userData: TypeAddEditUser): Promise<APIResponseBasic<string>>
}

export const registerNewUser: RegisterNewUserTypes = async (userData) => {
  const response = await fetch(`${USERS_WO_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  })
  const data = await response.json()

  if (!data.success) {
    return Promise.reject(data.result)
  } else {
    return data
  }
}

export const deleteUser: DeletePOSType = async (userID) => {
  const response = await fetch(`${USERS_WO_PATH}?${USER_TO_DELETE}=${userID}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })

  const deletedUser: APIResponseBasic<string> = await response.json()

  if (!deletedUser.success) {
    return Promise.reject(deletedUser.result)
  } else {
    return deletedUser
  }
}

export interface EditUserTypes {
  (userID: number, userData: TypeEditUserForm): Promise<
    APIResponseBasic<string>
  >
}

export const editUser: EditUserTypes = async (userID, userData) => {
  const response = await fetch(`${USERS_WO_PATH}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userID, userData }),
  })
  const data = await response.json()

  if (!data.success) {
    return Promise.reject(data.result)
  } else {
    return data
  }
}

/* !SC */
