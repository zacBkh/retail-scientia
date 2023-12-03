import { FC } from 'react'
import ClientWrapper from '@/components/product/product-cards-client-wrapper'

import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import DatePickerNewSale from '@/components/date-selector/date-picker-new-sale'

import { getProducts } from '@/services/prisma-queries'

import { URL_PARAMS_KEYS } from '@/constants/URLs'
const { PAGE, SEARCH, CATEGORY_1, SHOW_ONLY_FAV } = URL_PARAMS_KEYS

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
    typeof searchParams[PAGE] === 'string' ? Number(searchParams.page) : 1

  const search =
    typeof searchParams[SEARCH] === 'string'
      ? (searchParams[SEARCH] as string)
      : undefined

  const category1Query =
    typeof searchParams[CATEGORY_1] === 'string'
      ? (searchParams[CATEGORY_1] as string)
      : undefined

  const showOnlyFav =
    typeof searchParams[SHOW_ONLY_FAV] === 'string'
      ? (searchParams[SHOW_ONLY_FAV] as string)
      : undefined

  let dynamicSkip = 0
  let take = 20
  dynamicSkip = (+page - 1) * take

  const productsToDisplay = await getProducts(
    currentSession?.user.id,

    showOnlyFav ? true : false,

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
