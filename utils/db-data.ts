// Sum sales value for a user
import type { SalesWithProducts, APIResponseFindProducts } from '@/types'

export const sumSalesValue = (salesOfUser: SalesWithProducts) => {
  console.log('salesOfUser', salesOfUser)
  if (salesOfUser.length <= 0 || salesOfUser === undefined) {
    return
  }

  const totalValue = salesOfUser.reduce((acc, currValue) => {
    return acc + currValue.productSold.regularPrice
  }, 0)
  return totalValue
}

import { specificItemQty } from './local-storage'

export const sumSalesValueFromProdDetails = (
  productCartDetails: APIResponseFindProducts['result'],
  salesInLS: number[]
) => {
  if (
    productCartDetails.length <= 0 ||
    productCartDetails === undefined ||
    !salesInLS
  ) {
    return
  }

  const totalValue = productCartDetails.reduce((acc, currProduct) => {
    return (
      acc +
      currProduct.regularPrice * specificItemQty(salesInLS, currProduct.id)
    )
  }, 0)
  return totalValue
}
