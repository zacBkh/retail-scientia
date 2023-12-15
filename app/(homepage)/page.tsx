import { FC } from 'react'
import ClientWrapper from '@/components/product/product-cards-client-wrapper'

import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import DatePickerNewSale from '@/components/date-selector/date-picker-new-sale'

import { getProducts } from '@/services/prisma-queries'

import { URL_PARAMS_KEYS } from '@/constants/URLs'
const { SEARCH, CATEGORY_1, SHOW_ONLY_FAV, BRAND, AXIS } = URL_PARAMS_KEYS

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

export const revalidate = 0

const HomePage: FC<HomePageProps> = async ({ searchParams }) => {
  const currentSession = await getServerSession(authOptions)

  const arrayOfUsersBrandsID =
    currentSession?.user.brands.map((brand) => brand.id) ?? []

  const search =
    typeof searchParams[SEARCH] === 'string'
      ? (searchParams[SEARCH] as string)
      : undefined

  const category1Query =
    typeof searchParams[CATEGORY_1] === 'string'
      ? (searchParams[CATEGORY_1] as string)
      : undefined

  const brandQuery =
    typeof searchParams[BRAND] === 'string'
      ? (searchParams[BRAND] as string)
      : undefined

  const axisQuery =
    typeof searchParams[AXIS] === 'string'
      ? (searchParams[AXIS] as string)
      : undefined

  const showOnlyFav =
    typeof searchParams[SHOW_ONLY_FAV] === 'string'
      ? (searchParams[SHOW_ONLY_FAV] as string)
      : undefined

  console.log('showOnlyFav', showOnlyFav)

  const productsToDisplay = await getProducts(
    currentSession?.user.id,

    showOnlyFav === 'true' ? true : false,

    arrayOfUsersBrandsID,

    search,
    category1Query,
    brandQuery,
    axisQuery
  )

  return (
    <main className="flex flex-col items-center gap-y-4 text-black p-2 w-full">
      <DatePickerNewSale currentSession={currentSession} />
      <ClientWrapper
        fetchedProducts={productsToDisplay}
        currentUserID={currentSession?.user.id}
        arrayOfUsersBrandsID={arrayOfUsersBrandsID}
      />

      <div className="text-center">
        <p>Don&apos;t see the product you are looking for?</p>
        <a
          aria-label="Go to the top of the page"
          href="#"
          className={`text-[#6550b9] font-semibold block underline decoration-[#6550b9] decoration-2 underline-offset-2`}
        >
          Use filters to find products quickly!{' '}
        </a>
      </div>
      <ScrollToTopBtn
        className={'self-end md:self-auto sticky bottom-3 opacity-70'}
        iconStyle={'text-4xl text-zinc-500'}
      />
    </main>
  )
}

export default HomePage
