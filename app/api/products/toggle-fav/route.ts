import { NextRequest, NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

import { toggleProductAsFav } from '@/services/prisma-queries'

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
