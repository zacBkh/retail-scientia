import { FC } from 'react'
import ClientWrapper from '@/components/product/product-cards-client-wrapper'

import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import DatePickerNewSale from '@/components/date-selector/date-picker-new-sale'

import { getProducts } from '@/services/prisma-queries'

import { URL_PARAMS_KEYS } from '@/constants/URLs'
const { PAGE, SEARCH, CATEGORY_1, SHOW_ONLY_FAV } = URL_PARAMS_KEYS

import ScrollToTopBtn from '@/components/ui/scroll-to-top'

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

  console.log('page', page)

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

  const shouldPaginationBeActive =
    category1Query === undefined && showOnlyFav === undefined
  console.log('shouldPaginationBeActive', shouldPaginationBeActive)
  console.log('category1Query', category1Query)
  console.log('showOnlyFav', showOnlyFav)

  let skip = 0
  let take = 20
  skip = (+page - 1) * take

  const productsToDisplay = await getProducts(
    currentSession?.user.id,

    showOnlyFav ? true : false,

    arrayOfUsersBrandsID,

    search,
    category1Query,

    shouldPaginationBeActive,
    skip,
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
        shouldReplaceWithFreshDate={page === 1}
        isPaginationActive={shouldPaginationBeActive}
      />

      <ScrollToTopBtn
        className={'self-end md:self-auto sticky bottom-3'}
        iconStyle={'text-4xl text-zinc-500'}
      />
    </main>
  )
}

export default HomePage
