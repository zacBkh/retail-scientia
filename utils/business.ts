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
  return categories.map((category1) => {
    // Summing the sale
    const matchingSale = sales.find(
      (sale) => sale.productSold.category1 === category1
    )

    return {
      category1,
      sales: matchingSale ? matchingSale.productSold.regularPrice : 0,
    }
  })
}
