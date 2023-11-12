import { type NextRequest, NextResponse } from 'next/server'

import { addSales } from '@/services/prisma-queries'

import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

import { findSalesOfUser } from '@/services/prisma-queries'

export async function POST(request: Request) {
  const currentSession = await getServerSession(authOptions)

  const req = await request.json()
  const { date, productIDs } = req

  const saleRegistration = await addSales(
    new Date(date),
    Number(currentSession?.user?.id),
    productIDs
  )

  return NextResponse.json(
    {
      success: true,
      result: `You successfully added ${saleRegistration.count} sales`,
    },
    { status: 201 }
  )
}

export async function GET(request: NextRequest) {
  try {
    const queryDates = request.nextUrl.searchParams.get('dates') ?? null

    // If no date (user clear the calendar), send null to Prisma so no filter on date
    const isNoDate = queryDates && queryDates[0] === ','
    const arrayQueryDates = isNoDate ? null : queryDates?.split(',')

    const currentSession = await getServerSession(authOptions)
    const filteredSalesUser = await findSalesOfUser(
      Number(currentSession?.user?.id),
      arrayQueryDates
    )

    return NextResponse.json(
      {
        success: true,
        result: filteredSalesUser,
      },
      { status: 201 }
    )
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
