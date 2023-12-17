import { NextRequest, NextResponse } from 'next/server'

import { URL_PARAMS_KEYS } from '@/constants'
const { USER_ID, BRANDS_NAME_ONLY, STAFF_ONLY } = URL_PARAMS_KEYS
import { getUsers, getUniqueBrands } from '@/services/prisma-queries'

export async function GET(request: NextRequest) {
  const userID = request.nextUrl.searchParams.get(USER_ID) ?? null
  const isStaffOnly = request.nextUrl.searchParams.get(STAFF_ONLY)
    ? true
    : false

  // If want all users
  if (!userID) {
    const allUsers = await getUsers(isStaffOnly)
    console.log('allUsers', allUsers)

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
