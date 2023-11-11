import { type NextRequest, NextResponse } from 'next/server'

import { addSales } from '@/services/prisma-queries'

import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

import { findSalesOfUser } from '@/services/prisma-queries'
import { BsChatLeftDots } from 'react-icons/bs'

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
