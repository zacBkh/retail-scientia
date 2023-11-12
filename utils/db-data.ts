// Sum sales value
import type { SalesWithProducts } from '@/types'
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
