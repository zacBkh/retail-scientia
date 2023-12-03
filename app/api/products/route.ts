import { NextRequest, NextResponse } from 'next/server'

import {
  findSpecificProducts,
  getUniqueCategory1,
} from '@/services/prisma-queries'

export async function GET(request: NextRequest) {
  const brandIDs = request.nextUrl.searchParams.get('brandsIDs') ?? null

  if (!brandIDs) {
    return NextResponse.json(
      {
        success: false,
        result: 'There has been an error fetching the categories',
      },
      { status: 500 }
    )
  }

  const uniqueCat = await getUniqueCategory1(brandIDs.split(','))
  return NextResponse.json(
    {
      success: true,
      result: uniqueCat,
    },
    { status: 201 }
  )
}

export async function POST(request: Request) {
  const req = await request.json()

  const specificProducts = await findSpecificProducts(req.productIDsInLS)
  return NextResponse.json(
    {
      success: true,
      result: specificProducts,
    },
    { status: 201 }
  )
}
