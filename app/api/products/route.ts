import { NextRequest, NextResponse } from 'next/server'

import {
  findSpecificProducts,
  getUniqueAxis,
  getUniqueCategory1,
} from '@/services/prisma-queries'

import { URL_PARAMS_KEYS } from '@/constants'
const { GET_UNIQUE_CAT, BRANDS_IDS, GET_UNIQUE_AXIS } = URL_PARAMS_KEYS

export async function GET(request: NextRequest) {
  // if is asking for unqiue categories for select e.g
  if (request.nextUrl.searchParams.get(GET_UNIQUE_CAT)) {
    const brandIDs = request.nextUrl.searchParams.get(BRANDS_IDS) ?? null
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

  // if is asking for unqiue axis for select e.g
  if (request.nextUrl.searchParams.get(GET_UNIQUE_AXIS)) {
    const brandIDs = request.nextUrl.searchParams.get(BRANDS_IDS) ?? null
    if (!brandIDs) {
      return NextResponse.json(
        {
          success: false,
          result: 'There has been an error fetching the axis',
        },
        { status: 500 }
      )
    }

    const uniqueAxis = await getUniqueAxis(brandIDs.split(','))
    return NextResponse.json(
      {
        success: true,
        result: uniqueAxis,
      },
      { status: 201 }
    )
  }
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
