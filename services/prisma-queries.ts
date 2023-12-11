/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PrismaClient } from '@prisma/client'

// Hack so new prisma client is not created at every hot reload
let db: PrismaClient
if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient()
  console.log('Production: Created a new DB connection.')
} else {
  // @ts-ignore
  if (!global.db) {
    // @ts-ignore
    global.db = new PrismaClient()
    console.log('Development: Established DB connection.')
  }

  // @ts-ignore
  db = global.db
}

import { DB_QUERIES } from '@/constants/db-queries'

export const getProducts = async (
  userID: string | undefined,

  showOnlyFav: boolean,

  arrayOfBrandsID: number[] | undefined,

  searchQuery?: string,
  category1Query?: string,

  brandName?: string,
  axisName?: string
) => {
  const shouldTakeBeDisabled =
    showOnlyFav || category1Query?.length ? true : false

  const searchedProducts = await db.product.findMany({
    // Return procuct
    where: {
      AND: [
        // Which belongs to brands of user
        {
          brandId: {
            in: arrayOfBrandsID,
          },
        },

        // Return only fav
        showOnlyFav && userID
          ? {
              favouritedBy: {
                some: {
                  id: {
                    equals: +userID,
                  },
                },
              },
            }
          : {},

        // if search query, filter by it
        searchQuery
          ? {
              description: {
                contains: searchQuery,
                mode: 'insensitive',
              },
            }
          : {},

        // if category filter
        category1Query
          ? { category1: { equals: category1Query, mode: 'insensitive' } }
          : {},

        // if brand filter
        brandName
          ? {
              brand: { name: { equals: brandName, mode: 'insensitive' } },
            }
          : {},

        // if axis filter
        axisName
          ? {
              axis: { equals: axisName, mode: 'insensitive' },
            }
          : {},
      ],
    },

    include: { favouritedBy: { select: { id: true } } },
    orderBy: showOnlyFav ? { sales: { _count: 'desc' } } : undefined,

    ...(shouldTakeBeDisabled ? {} : { take: DB_QUERIES.QTY_RECORDS_TO_RETURN }),
  })

  return searchedProducts
}

export const addSales = async (
  date: Date,
  sellerId: number,
  productIDs: number[]
) => {
  // Changing the shape
  const finalObject = productIDs.map((skuID) => {
    return { date, productId: skuID, sellerId }
  })

  const createdSales = await db.sale.createMany({
    data: finalObject,
  })

  return createdSales
}

export const findSpecificProducts = async (arrayOfIDs: number[]) => {
  const products = await db.product.findMany({
    where: {
      id: {
        in: arrayOfIDs,
      },
    },
  })
  return products
}

export const findAUser = async (email: string) => {
  const user = await db.user.findUnique({
    include: { brands: true },
    where: {
      email: email,
    },
  })
  return user
}

import type { SalesWithProducts } from '@/types'

interface FindSalesOfUserArgs {
  (
    userID: number,
    dateQuery?: string[] | null,
    brandsIDs?: string[]
  ): Promise<SalesWithProducts>
}

// If no dateQuery supplied, it will get everything
export const findSalesOfUser: FindSalesOfUserArgs = async (
  userID,
  dateQuery,
  brandsIDs
) => {
  const isSingleDate = dateQuery && dateQuery[0] === dateQuery[1]
  const userSales = await db.sale.findMany({
    // nested include
    include: { productSold: { include: { brand: true } }, seller: true },

    where: {
      // Filter by user
      sellerId: userID,

      // Filter by dates
      ...(dateQuery && {
        date: {
          gte: new Date(dateQuery[0]),
          lte: new Date(isSingleDate ? dateQuery[0] : dateQuery[1]),
        },
      }),

      // Filter by brand(s)
      ...(brandsIDs && {
        productSold: {
          brand: { name: { in: brandsIDs, mode: 'insensitive' } },
        },
      }),
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return userSales
}

interface GetSalesByTopSoldSKU {
  (userID: number, dateQuery?: string[] | null): Promise<any>
}

// Getting the sales by order of SKU occurence for a certain user
// Had to do 2 queries bcs prisma does not support groupBy & include: https://www.prisma.io/docs/concepts/components/prisma-client/aggregation-grouping-summarizing#groupby-faq:~:text=You%20cannot%20use%20select%20with%20groupBy

export const getSalesByBestSellerSku: GetSalesByTopSoldSKU = async (
  userID,
  dateQuery
) => {
  const isSingleDate = dateQuery && dateQuery[0] === dateQuery[1]

  const salesByProduct = await db.sale.groupBy({
    by: ['productId'],

    where: {
      sellerId: userID,

      ...(dateQuery && {
        date: {
          gte: new Date(dateQuery[0]),
          lte: new Date(isSingleDate ? dateQuery[0] : dateQuery[1]),
        },
      }),
    },
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: 'desc', // Order by the count of sales in descending order
      },
    },
    take: 6,
  })

  // Get all products details whose id is included in the result of group query
  const productsFetched = await db.product.findMany({
    where: {
      id: { in: salesByProduct.map((sku) => sku.productId) },
    },
  })

  // Map together the products and their count
  const finalSKUOrder = salesByProduct.map((sku) => {
    const productToAdd = productsFetched.find(
      (product) => product.id === sku.productId
    )
    const count = sku._count.id
    return { productSold: { ...productToAdd, count } }
  })

  return finalSKUOrder
}

export const getFavOfUser = async (
  currentUserID: number,
  productID: number
) => {
  // Get user's favourite
  const product = await db.product.findUnique({
    where: { id: productID },
    // Only returns favouritedBy
    select: {
      favouritedBy: {
        select: {
          id: true,
        },
      },
    },
  })
  console.log('product ', product)
  const mappedProducts = product?.favouritedBy.map((product) => product.id)
  if (mappedProducts?.includes(currentUserID)) {
    return true
  } else {
    return false
  }
}

export const toggleProductAsFav = async (
  currentUserID: number,
  productID: number,
  isAlreadyFav: boolean
) => {
  // Get user's favourite
  const user = await db.user.findUnique({
    where: { id: currentUserID },
    include: { favoriteProducts: { select: { id: true } } },
  })

  // Map them to an array
  const userFavArrayIDSKU =
    user?.favoriteProducts.map((product) => product.id) || []

  // If already fav, pull, otherwise, push
  const updatedFavoriteProductIds = isAlreadyFav
    ? userFavArrayIDSKU.filter((id) => id !== productID)
    : [...userFavArrayIDSKU, productID]

  // Mutate the array on DB
  await db.user.update({
    where: { id: currentUserID },
    data: {
      favoriteProducts: {
        set: updatedFavoriteProductIds.map((id) => ({ id })),
      },
    },
  })
}

export const getUniqueCategory1 = async (userBrandsIDs: string[]) => {
  const userBrandsIDsNumber = userBrandsIDs.map((id) => Number(id))
  const queryUnique = await db.product.findMany({
    where: { brandId: { in: userBrandsIDsNumber } },
    orderBy: { sales: { _count: 'desc' } },
    select: { category1: true },
    distinct: ['category1'],
  })
  const uniqueCat = queryUnique.map((item) => item.category1)

  return uniqueCat
}

export const getUniqueBrands = async (
  userID: string,
  brandsNameOnly: boolean
) => {
  const userIDNumber = +userID

  let selectClause
  if (brandsNameOnly) {
    selectClause = { brands: { select: { name: true } } }
  } else {
    selectClause = { brands: { select: { name: true, logo: true, id: true } } }
  }

  const brands = await db.user.findUnique({
    where: { id: userIDNumber },
    select: selectClause,
  })

  if (brandsNameOnly) {
    const brandArray = brands?.brands?.map((brand) => brand.name)
    return brandArray
  } else {
    return brands?.brands
  }

  // const brandArray = brands?.brands?.map((brand) => {
  //   brand.name, brand.logo, brand.id
  // })
}
export const getUniqueAxis = async (userBrandsIDs: string[]) => {
  const userBrandsIDsNumber = userBrandsIDs.map((id) => Number(id))
  const queryUnique = await db.product.findMany({
    where: { brandId: { in: userBrandsIDsNumber } },
    orderBy: { sales: { _count: 'desc' } },
    select: { axis: true },
    distinct: ['axis'],
  })
  const uniqueAxis = queryUnique.map((item) => item.axis)

  return uniqueAxis
}
