import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Zacharie',
      email: 'zachariedupain@hotmail.fr',
      country: 'UAE',
      pointOfSale: 'Dubai Duty Free',
      password: 'foueted93',
      isAdmin: true,
    },
  })
  console.log('user created', user)

  //   const product = await prisma.product.create({
  //     data: {

  //     },
  //   })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
