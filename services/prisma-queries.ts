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

// Fetch all
export const addSale = async (details: Sale) => {
  console.log('details from api', details)

  // const allProducts = await db.sale.create({
  //   data: {},
}
