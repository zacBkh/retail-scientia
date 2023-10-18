import { PrismaClient, Prisma } from '@prisma/client'
const PrismaConnector = new PrismaClient()

// Fetch all
export const fetchLikesCount = async () => {
  const user = await PrismaConnector.user.findMany()
  return user
}
