import type { Prisma, Product, Sales, User } from '@prisma/client'

import { TypeEditUserForm } from './components/forms/add-user/form-add-user'

// Using generics (make this type flexible)
export type APIResponseBasic<T> = {
  success: boolean
  result: T
}

export type APIResponseRegisterSales = APIResponseBasic<string>
export type APIResponseFindProducts = APIResponseBasic<Product[]>
export type APIResponseToggleFav = APIResponseBasic<string>
export type APIResponseGetFav = APIResponseBasic<boolean>

// LS
export type SalesInLocalStorage = number[]

// Sales of a user with the product populated
export type SalesWithProducts = Prisma.SaleGetPayload<{
  include: { productSold: true; seller: true }
}>[]

export type APIResponseFindUserSales = APIResponseBasic<SalesWithProducts>

export type DateRangeTypeExt = {
  startDate: string
  endDate: string
}

export type SalesWithCategory = {
  category1: string
  sales: number
}[]

export type ProductsWithFav = Prisma.ProductGetPayload<{
  include: {
    favouritedBy: {
      select: {
        id: true
      }
    }
  }
}>

export interface GetFilteredUserSalesInDB {
  (
    dateQuery?: string[],
    byTopSeller?: boolean,
    brandsIDs?: string[]
  ): Promise<APIResponseFindUserSales>
}

// Only POS
export type AllPOS = Prisma.$PointOfSalePayload

// Point of sales with users
export type POSWithUsers = Prisma.PointOfSaleGetPayload<{
  include: { users: true }
}>

// Users with POS
export type UserWithPOSAndBrands = Prisma.UserGetPayload<{
  include: { pointOfSale: true; brands: true }
}>

// User with brands
export type UserWithBrands = Prisma.UserGetPayload<{
  include: {
    brands: {
      select: {
        id: true
      }
    }
  }
}>

// User without pwd
export type UserWithoutPwd = Omit<User, 'password'>
