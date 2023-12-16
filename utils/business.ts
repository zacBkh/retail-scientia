import type { SalesWithProducts } from '@/types'

interface ExtractUniqueCategoryFromSalesArgs {
  (sales: SalesWithProducts): string[]
}

export const extractUniqueCategoryFromSales: ExtractUniqueCategoryFromSalesArgs =
  (sales) => {
    const allCategories = sales.map((sale) => {
      return sale.productSold.category1
    })

    return [...new Set(allCategories)]
  }

import type { SalesWithCategory } from '@/types'

interface CombineCategoriesAndSalesArgs {
  (categories: string[], sales: SalesWithProducts): SalesWithCategory
}

// Will give
/*  
[
    {
        "category1": "Terre d'Hermès",
        "sales": 132
    },
    {
        "category1": "Collection Hermessence",
        "sales": 2830
    },
    {
        "category1": "Twilly d'Hermès",
        "sales": 69
    },
    {
        "category1": "Eau des Merveilles",
        "sales": 118
    }
]
*/
export const combineCategoriesAndSales: CombineCategoriesAndSalesArgs = (
  categories,
  sales
) => {
  const nonSortedSales = categories.map((category1) => {
    // iterating through each category

    //
    const onlySalesOfCurrentCat = sales
      .filter((sale) => sale.productSold.category1 === category1) // grab the sales from this cat
      .map((sale) => sale.productSold.currentPrice) // keep only their price

    // Sum their value
    const matchingTtlSale = onlySalesOfCurrentCat.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    )

    return {
      category1,
      sales: matchingTtlSale ? matchingTtlSale : 0,
    }
  })

  return nonSortedSales.sort((a, b) => b.sales - a.sales)
}

type UserFav = {
  id: number
}[]
export const checkIfIsUserFav = (
  arrayOfUserIDs: UserFav,
  currentUserID: string | null
) => {
  if (!arrayOfUserIDs.length || !currentUserID) {
    return false
  }

  const pureArray = arrayOfUserIDs.map((item) => item.id)

  if (pureArray.includes(+currentUserID)) {
    return true
  }

  return false
}
