import {
  Flex,
  Text,
  Button,
  Heading,
  AlertDialog,
  Box,
  Container,
} from '@radix-ui/themes'

import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'

import { findSalesOfUser } from '@/services/prisma-queries'

import { sumSalesValue } from '@/utils/db-data'

const Dashboard = async () => {
  const currentSession = await getServerSession(authOptions)
  console.log('currentSession from radix', currentSession?.user.id)

  if (!currentSession) {
    return <p>Pas de session</p>
  }

  // MOST LIKELY NEED TO HANDLE THAT IN PROD BECAUSE NOW ITS STATIC
  const salesOfUser = await findSalesOfUser(Number(currentSession?.user.id), [
    '2023-11-09',
    '2023-11-10',
  ])

  const ttlSalesValue = sumSalesValue(salesOfUser)

  return (
    <>
      <Container>
        <Box p={'3'}>
          <Heading>Dashboard</Heading>
          <Text>Hello from Radix Themes!</Text>
        </Box>

        <Box p={'3'}>
          <Flex direction={'column'} gap="3">
            <Text>Total sales value since beginning: {ttlSalesValue}</Text>
            <Text>Total sales qty beginning: {salesOfUser.length}</Text>
          </Flex>
        </Box>
      </Container>
    </>
  )
}

export default Dashboard
