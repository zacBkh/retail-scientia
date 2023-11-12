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

const Radix = async () => {
  const currentSession = await getServerSession(authOptions)
  console.log('currentSession from radix', currentSession?.user.id)

  if (!currentSession) {
    return <p>Pas de session</p>
  }

  // MOST LIKELY NEED TO HANDLE THAT IN PROD ITS STATIC
  const salesOfUser = await findSalesOfUser(Number(currentSession?.user.id))

  const totalSales = sumSalesValue(salesOfUser)
  console.log('totalSales', totalSales)

  console.log('salesOfUser++', salesOfUser)

  return (
    <>
      <Container>
        <Box p={'3'}>
          <Heading>Dashboard</Heading>
          <Text>Hello from Radix Themes!</Text>
        </Box>

        <Box p={'3'}>
          <Flex direction={'column'} gap="3">
            <Text>Total sales value since beginning: {totalSales}</Text>
            <Text>Total sales qty beginning: {salesOfUser.length}</Text>
          </Flex>
        </Box>
      </Container>

      {/* <Flex direction={'column'} gap="2">
        {salesOfUser.map((sale) => (
          <Text size={'1'} key={sale.id}>
            {' '}
            {sale.productSold.description}
          </Text>
        ))}
      </Flex> */}
    </>

    // <Flex direction="column" gap="2">
    //   <Button>Let's go</Button>

    //   <Heading mb="2" size="4">
    //     Typographic principles
    //   </Heading>

    //   <AlertDialog.Root>
    //     <AlertDialog.Trigger>
    //       <Button color="red">Revoke access</Button>
    //     </AlertDialog.Trigger>
    //     <AlertDialog.Content style={{ maxWidth: 450 }}>
    //       <AlertDialog.Title>Revoke access</AlertDialog.Title>
    //       <AlertDialog.Description size="2">
    //         Are you sure? This application will no longer be accessible and any
    //         existing sessions will be expired.
    //       </AlertDialog.Description>

    //       <Flex gap="3" mt="4" justify="end">
    //         <AlertDialog.Cancel>
    //           <Button variant="soft" color="gray">
    //             Cancel
    //           </Button>
    //         </AlertDialog.Cancel>
    //         <AlertDialog.Action>
    //           <Button variant="solid" color="red">
    //             Revoke access
    //           </Button>
    //         </AlertDialog.Action>
    //       </Flex>
    //     </AlertDialog.Content>
    //   </AlertDialog.Root>
    // </Flex>
  )
}

export default Radix
