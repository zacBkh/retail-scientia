import { NextRequest, NextResponse } from 'next/server'

import { URL_PARAMS_KEYS } from '@/constants'
const { USER_ID, BRANDS_NAME_ONLY, ACCOUNT_TYPE, POS_TO_EXCLUDE } =
  URL_PARAMS_KEYS
import { getUsers, getUniqueBrands } from '@/services/prisma-queries'

import { AccountType } from '@prisma/client'

export async function GET(request: NextRequest) {
  const userID = request.nextUrl.searchParams.get(USER_ID) ?? null
  const specificAccTypes = request.nextUrl.searchParams.get(ACCOUNT_TYPE)

  const posToExclude = request.nextUrl.searchParams.get(POS_TO_EXCLUDE)
  const posToExcludeNumb = posToExclude
    ? posToExclude?.split(',')?.map((pos) => +pos)
    : undefined

  // If does not want unique brands
  if (!userID) {
    const allUsers = await getUsers(
      specificAccTypes?.split(',') as AccountType[],
      posToExcludeNumb
    )

    return NextResponse.json(
      {
        success: true,
        result: allUsers,
      },
      { status: 201 }
    )
  }

  // if want brand of user in the contect of getUniqueBrands -- TO REFACTO dynamic segments TODO

  const brandsNameOnly =
    request.nextUrl.searchParams.get(BRANDS_NAME_ONLY) === 'true' ? true : false

  const brandsOfUser = await getUniqueBrands(userID, brandsNameOnly)
  return NextResponse.json(
    {
      success: true,
      result: brandsOfUser,
    },
    { status: 201 }
  )
}
