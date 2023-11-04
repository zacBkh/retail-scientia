import type { Product } from '@prisma/client'

// Using generics (make this type flexible)
export type APIAnswerBasic<T> = {
  success: boolean
  result: T
}

export type APIRegisterSales = APIAnswerBasic<string>
export type APIAnswerFindProducts = APIAnswerBasic<Product[]>

// LS
export type SalesInLocalStorage = number[]

// Cart Item
export type CartItemType = Pick<
  Product,
  'id' | 'description' | 'img' | 'regularPrice' | 'size' | 'category1'
> & { onLoadQty: () => void }
