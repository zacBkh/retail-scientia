import { NextRequest, NextResponse } from 'next/server'

import { URL_PARAMS_KEYS } from '@/constants/URLs'
import { getUniqueBrands } from '@/services/prisma-queries'

export async function GET(request: NextRequest) {
  const userID =
    request.nextUrl.searchParams.get(URL_PARAMS_KEYS.USER_ID) ?? null

  const brandsNameOnly =
    request.nextUrl.searchParams.get(URL_PARAMS_KEYS.BRANDS_NAME_ONLY) ===
    'true'
      ? true
      : false

  if (!userID) {
    return NextResponse.json(
      {
        success: false,
        result: 'There has been an error fetching the brands',
      },
      { status: 500 }
    )
  }

  const brandsOfUser = await getUniqueBrands(userID, brandsNameOnly)
  return NextResponse.json(
    {
      success: true,
      result: brandsOfUser,
    },
    { status: 201 }
  )
}
