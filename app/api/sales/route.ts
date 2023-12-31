import { type NextRequest, NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

import {
  findSalesOfUser,
  getSalesByBestSellerSku,
  addSales,
} from '@/services/prisma-queries'

import { URL_PARAMS_KEYS } from '@/constants'

import { checkIfDateIsAfter } from '@/utils/dates'

const { BY_TOP_SELLER, BRANDS_IDS } = URL_PARAMS_KEYS

export async function POST(request: Request) {
  const currentSession = await getServerSession(authOptions)

  const req = await request.json()
  const { date: suppliedSalesDate, productIDs } = req

  if (checkIfDateIsAfter(suppliedSalesDate)) {
    return NextResponse.json(
      {
        success: false,
        result: `The dates supplied is not valid`,
      },
      { status: 500 }
    )
  }

  const saleRegistration = await addSales(
    new Date(suppliedSalesDate),
    Number(currentSession?.user?.id),
    productIDs
  )

  return NextResponse.json(
    {
      success: true,
      result: `You successfully added ${saleRegistration.count} ${
        saleRegistration.count > 1 ? 'sales' : 'sale'
      }`,
    },
    { status: 201 }
  )
}

// Send sales either by chroological order (findSalesOfUser) or by top ref sold (getSalesByBestSellerSku)
export async function GET(request: NextRequest) {
  try {
    // Getting query params
    const queryDates = request.nextUrl.searchParams.get('dates') ?? null

    const byTopSeller =
      request.nextUrl.searchParams.get(BY_TOP_SELLER) === 'true'

    // Formatting optional brandsIDs to array of number
    const reqBrandNames = request.nextUrl.searchParams.get(BRANDS_IDS)
    const brandNames = reqBrandNames === 'undefined' ? null : reqBrandNames

    let brandNamesArr
    if (brandNames) {
      brandNamesArr = brandNames?.split(',')
    }

    const currentSession = await getServerSession(authOptions)

    // If no date (user clear the calendar), send null to Prisma so no filter on date
    const isNoDate = queryDates && queryDates[0] === ','
    const arrayQueryDates = isNoDate ? null : queryDates?.split(',')

    // If query param mentionned only top sellers should be sent
    if (byTopSeller) {
      const filteredSalesUserByTopSeller = await getSalesByBestSellerSku(
        Number(currentSession?.user?.id),
        arrayQueryDates
      )

      return NextResponse.json(
        {
          success: true,
          result: filteredSalesUserByTopSeller,
        },
        { status: 201 }
      )
    } else {
      const filteredSalesUser = await findSalesOfUser(
        Number(currentSession?.user?.id),
        arrayQueryDates,
        brandNamesArr
      )

      return NextResponse.json(
        {
          success: true,
          result: filteredSalesUser,
        },
        { status: 201 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        result:
          'Something went wrong with your request, please try again later.',
      },
      { status: 500 }
    )
  }
}
