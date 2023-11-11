// Sum sales value
import type { SalesWithProducts } from '@/types'
export const sumSalesValue = (salesOfUser: SalesWithProducts) => {
  const totalValue = salesOfUser.reduce((acc, currValue) => {
    return acc + currValue.productSold.regularPrice
  }, 0)
  return totalValue
}
