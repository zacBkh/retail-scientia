import { FC } from 'react'
import ClientWrapper from '@/components/product/product-cards-client-wrapper'

import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import DatePickerNewSale from '@/components/date-selector/date-picker-new-sale'

import { getProducts } from '@/services/prisma-queries'

interface HomePageProps {
  searchParams: { [search: string]: string | string[] | undefined }
}

// TODO TYPE SEARCH PARAMS
// type PostsPageSearchParams = {
//   page?: string;
//   sort_by?: string;
//   sort_order?: "asc" | "desc";
// };

const HomePage: FC<HomePageProps> = async ({ searchParams }) => {
  const currentSession = await getServerSession(authOptions)

  const arrayOfUsersBrandsID =
    currentSession?.user.brands.map((brand) => brand.id) ?? []

  const page =
    typeof searchParams.page === 'string' ? Number(searchParams.page) : 1

  const search =
    typeof searchParams.search === 'string' ? searchParams.search : undefined

  const category1Query =
    typeof searchParams.category1 === 'string'
      ? searchParams.category1
      : undefined

  let dynamicSkip = 0
  let take = 20
  dynamicSkip = (+page - 1) * take

  const productsToDisplay = await getProducts(
    arrayOfUsersBrandsID,

    search,
    category1Query,

    dynamicSkip,
    take
  )

  return (
    <main className="flex flex-col items-center gap-y-4 text-black p-2 w-full">
      <DatePickerNewSale currentSession={currentSession} />

      <ClientWrapper
        currentPage={page}
        currentUserID={currentSession?.user.id}
        arrayOfUsersBrandsID={arrayOfUsersBrandsID}
        fetchedProducts={productsToDisplay}
        shouldReplaceWithFreshDate={page === 1 || category1Query !== undefined}
      />
    </main>
  )
}

export default HomePage
