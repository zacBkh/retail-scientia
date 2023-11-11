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

export const findSalesOfUser = async (userID: number) => {
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
    },
  })

  return userSales
}
