'use server'

import { getProducts } from '@/services/prisma-queries'

interface GetProductsActionParams {
  (userID: string | undefined, search?: string, page?: number): Promise<any>
}

const getProductsAction: GetProductsActionParams = async (
  userID,
  search,
  page = 1
) => {
  const products = await getProducts(userID, search)
  return products
}

export default getProductsAction
