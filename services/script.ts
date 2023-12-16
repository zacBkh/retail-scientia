// import { PrismaClient } from '@prisma/client'

// // Hack so new prisma client is not created at every hot reload
// let db: PrismaClient
// if (process.env.NODE_ENV === 'production') {
//   db = new PrismaClient()
//   console.log('Production: Created a new DB connection.')
// } else {
//   // @ts-ignore
//   if (!global.db) {
//     // @ts-ignore
//     global.db = new PrismaClient()
//     console.log('Development: Created DB connection.')
//   }

//   // @ts-ignore
//   db = global.db
// }

// // async function createUser() {
// //   const user = await db.user.create({
// //     data: {
// //       name: 'Zacharie',
// //       email: 'zachariedupain@hotmail.fr',
// //       country: 'UAE',
// //       pointOfSale: 'Dubai Duty Free',
// //       isAdmin: true,
// //     },
// //   })
// //   console.log('user created', user)

// //   //   const product = await prisma.product.create({
// //   //     data: {

// //   //     },
// //   //   })
// // }

// async function getSalesByBestSellerSku() {
//   const salesByProduct = await db.sale.groupBy({
//     by: ['productId'],

//     where: {
//       sellerId: 3,
//       //   ...(dateQuery && {
//       date: {
//         //   gte: new Date(dateQuery[0]),
//         gte: new Date('2023-11-15'),
//         lte: new Date('2023-11-18'),
//       },
//       //   }),
//     },
//     _count: {
//       id: true,
//     },
//     orderBy: {
//       _count: {
//         id: 'desc', // Order by the count of sales in descending order
//       },
//     },
//   })
//   console.log('salesByProduct', salesByProduct)
// }

// createUser()
// getSalesByBestSellerSku()
//   .then(async () => {
//     await db.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await db.$disconnect()
//     process.exit(1)
//   })
