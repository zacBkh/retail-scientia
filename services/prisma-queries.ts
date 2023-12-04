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

export const getProducts = async (
  userID: string | undefined,

  showOnlyFav: boolean,

  arrayOfBrandsID: number[] | undefined,

  searchQuery?: string,
  category1Query?: string,

  shouldPaginationBeActive = true,
  skip = 0,
  pageSize = 20
) => {
  console.log('skip', skip)
  console.log('pageSize', pageSize)
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
      ],
    },

    include: { favouritedBy: { select: { id: true } } },

    orderBy: showOnlyFav ? { sales: { _count: 'desc' } } : undefined,

    // skip: searchQuery?.length ? 0 : skip,
    // take: searchQuery?.length ? 120 : pageSize,
    ...(shouldPaginationBeActive
      ? {
          skip: searchQuery?.length ? 0 : skip,
          take: searchQuery?.length ? 120 : pageSize,
        }
      : {}),
  })

  return searchedProducts
}

// export const getUniqueCategory1 = async (brandID: number) => {
//   const queryUnique = await db.product.findMany({
//     where: { brandId: brandID },
//     orderBy: { sales: { _count: 'desc' } },
//     select: { category1: true },
//     distinct: ['category1'],
//   })
//   const uniqueCat = queryUnique.map((item) => item.category1)
//   return uniqueCat
// }

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
  console.log('user ---> auth', user)
  return user
}

import type { SalesWithProducts } from '@/types'

interface FindSalesOfUserArgs {
  (userID: number, dateQuery?: string[] | null): Promise<SalesWithProducts>
}

// If no dateQuery supplied, it will get everything
export const findSalesOfUser: FindSalesOfUserArgs = async (
  userID,
  dateQuery
) => {
  const isSingleDate = dateQuery && dateQuery[0] === dateQuery[1]
  const userSales = await db.sale.findMany({
    // include: {
    //   productSold: {
    //     select: {
    //       id: true,
    //       description: true,
    //       size: true,
    //     },
    //   },
    // },
    // include: { productSold: true, seller: true },
    include: { productSold: { include: { brand: true } }, seller: true },

    where: {
      sellerId: userID,
      ...(dateQuery && {
        date: {
          gte: new Date(dateQuery[0]),
          lte: new Date(isSingleDate ? dateQuery[0] : dateQuery[1]),
        },
      }),
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  console.log('userSales --->', userSales)
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

export const addProductAsFav = async (
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

export const getUniqueBrands = async (userID: string) => {
  const userIDNumber = +userID
  const brands = await db.user.findUnique({
    where: { id: userIDNumber },
    select: { brands: { select: { name: true } } },
  })

  const brandArray = brands?.brands?.map((brand) => brand.name)
  console.log('brandArray', brandArray)

  return brandArray
}
