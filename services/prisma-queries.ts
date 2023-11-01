/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PrismaClient, Sale } from '@prisma/client'

let db: PrismaClient
if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient()
  console.log('Production: Created DB connection.')
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

// const PrismaConnector = new PrismaClient()

// Fetch all products
export const getAllProducts = async () => {
  const allProducts = await db.product.findMany()
  return allProducts
}

export const addSales = async (date: Date, productIDs: number[]) => {
  // Changing the shape
  const finalObject = productIDs.map((id) => {
    return { date, productId: id, sellerId: 1 }
  })

  const createdSales = await db.sale.createMany({
    data: finalObject,
  })

  console.log('created', createdSales.count, 'sales on DB')

  return createdSales
}
