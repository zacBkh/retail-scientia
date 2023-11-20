/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Prisma, PrismaClient } from '@prisma/client'

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
    console.log('Development: Created DB connection.')
  }

  // @ts-ignore
  db = global.db
}

// Fetch all products
export const getAllProducts = async () => {
  // const allProducts = await db.product.findMany({ take: 50 })
  const allProducts = await db.product.findMany({
    where: { img: { not: '' } },
  })
  return allProducts
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
    include: { productSold: true },

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
