import { NextRequest, NextResponse } from 'next/server'

import { addSales } from '@/services/prisma-queries'

export async function POST(request: Request) {
  const req = await request.json()
  console.log('req from API route', req)

  const { date, productIDs } = req

  const saleRegistration = await addSales(new Date(date), productIDs)

  console.log('created record of sale', saleRegistration)
  return NextResponse.json(
    {
      success: true,
      result: `You successfully added ${saleRegistration.count} sales`,
    },
    { status: 201 }
  )
}
