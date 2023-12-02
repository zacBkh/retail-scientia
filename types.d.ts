import type { Prisma, Product, Sales } from '@prisma/client'

// Using generics (make this type flexible)
export type APIAnswerBasic<T> = {
  success: boolean
  result: T
}

export type APIResponseRegisterSales = APIAnswerBasic<string>
export type APIResponseFindProducts = APIAnswerBasic<Product[]>
export type APIResponseToggleFav = APIAnswerBasic<string>

// LS
export type SalesInLocalStorage = number[]

// Cart Item
export type CartItemType = Pick<
  Product,
  'id' | 'description' | 'img' | 'regularPrice' | 'size' | 'category1'
> /* & { onUpdateQty: () => void } */

// Sales of a user with the product populated
export type SalesWithProducts = Prisma.SaleGetPayload<{
  include: { productSold: true; seller: true }
}>[]

export type APIResponseFindUserSales = APIAnswerBasic<SalesWithProducts>

export type DateRangeTypeExt = {
  startDate: string
  endDate: string
}

import { HERMES_LINE_NAME } from './constants/business'

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
    byTopSeller?: boolean
  ): Promise<APIResponseFindUserSales>
}
