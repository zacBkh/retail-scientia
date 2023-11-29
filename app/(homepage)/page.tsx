import { FC } from 'react'
import ClientWrapper from '@/components/product/product-cards-client-wrapper'

import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import DatePickerNewSale from '@/components/date-selector/date-picker-new-sale'

import { getSearchedProducts } from '@/services/prisma-queries'

interface HomePageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

// type PostsPageSearchParams = {
//   page?: string;
//   sort_by?: string;
//   sort_order?: "asc" | "desc";
// };

const HomePage: FC<HomePageProps> = async ({ searchParams }) => {
  const currentSession = await getServerSession(authOptions)
  console.log('currentSession', currentSession)

  const page =
    typeof searchParams.page === 'string' ? Number(searchParams.page) : 1
  const limit =
    typeof searchParams.limit === 'string' ? Number(searchParams.limit) : 10
  const search =
    typeof searchParams.search === 'string' ? searchParams.search : undefined

  console.log('searchParams', searchParams)
  console.log('search', search)

  const productsToDisplay = await getSearchedProducts(
    currentSession?.user.id,
    search
  )

  console.log('productsToDisplay', productsToDisplay)

  return (
    <main className="flex flex-col items-center gap-y-4 text-black p-2 w-full">
      <DatePickerNewSale currentSession={currentSession} />

      <ClientWrapper
        currentUserID={currentSession?.user.id}
        allProducts={productsToDisplay}
      />
    </main>
  )
}

export default HomePage
