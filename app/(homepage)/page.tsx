import { getAllProducts } from '@/services/prisma-queries'

import DateSelector from '@components/date-selector/date-selector'
import ClientWrapper from '@/components/product/product-cards-client-wrapper'

import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'

const HomePage = async () => {
  const currentSession = await getServerSession(authOptions)
  console.log('currentSession', currentSession)

  const allProducts = await getAllProducts()

  return (
    <main className="flex flex-col items-center gap-y-4 text-black p-2">
      <DateSelector />

      <ClientWrapper allProducts={allProducts} />
    </main>
  )
}

export default HomePage
