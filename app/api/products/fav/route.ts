import { NextRequest, NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

import { toggleProductAsFav, getFavOfUser } from '@/services/prisma-queries'

import { URL_PARAMS_KEYS } from '@/constants/URLs'
const { PRODUCT_ID } = URL_PARAMS_KEYS

// Know if the passed product is fav
export async function GET(request: NextRequest) {
  const currentSession = await getServerSession(authOptions)
  const currentUserID = currentSession?.user.id

  const productToCheckIfFav = request.nextUrl.searchParams.get(PRODUCT_ID)

  if (!productToCheckIfFav || !currentUserID) {
    console.log('------>', request.nextUrl.searchParams.get(PRODUCT_ID))

    return NextResponse.json(
      {
        success: false,
        result: 'Something went wrong',
      },
      { status: 500 }
    )
  }

  const isThisProductFav = await getFavOfUser(
    +currentUserID,
    +productToCheckIfFav
  )

  return NextResponse.json(
    {
      success: true,
      result: isThisProductFav,
    },
    { status: 201 }
  )
}

// Toggle fav
export async function POST(request: Request) {
  const currentSession = await getServerSession(authOptions)
  const currentUserID = currentSession?.user.id
  const req = await request.json()

  if (!currentUserID) {
    return NextResponse.json(
      {
        success: false,
        result: 'Wrong Authentication',
      },
      { status: 500 }
    )
  }

  await toggleProductAsFav(+currentUserID, req.productID, req.isFav)

  const feedbackMsg = req.isFav
    ? 'Removed from favourites.'
    : 'Adddded to favourites.'

  return NextResponse.json(
    {
      success: true,
      result: feedbackMsg,
    },
    { status: 201 }
  )
}
