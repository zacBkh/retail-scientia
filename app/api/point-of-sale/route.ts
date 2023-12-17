import { type NextRequest, NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

import { URL_PARAMS_KEYS } from '@/constants'
const { POS_TO_DELETE } = URL_PARAMS_KEYS

import { AccountType } from '@prisma/client'

import { addNewPOS, deletePOS } from '@/services/prisma-queries'

import { Prisma } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const currentSession = await getServerSession(authOptions)
    const isAdmin = currentSession?.user.accountType === AccountType.Admin

    if (!isAdmin) {
      throw new Error('You cannot delete a POS due to your account level.')
    }

    const newPOS = await request.json()
    const newPOSFetch = await addNewPOS(newPOS)

    return NextResponse.json(
      {
        success: true,
        result: `${newPOSFetch.name} has been successfully added`,
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        result: error,
      },
      { status: 500 }
    )
  }
}

// export async function GET(request: NextRequest) {

// }

export async function PATCH(request: NextRequest) {}
export async function DELETE(request: NextRequest) {
  try {
    const currentSession = await getServerSession(authOptions)
    const isAdmin = currentSession?.user.accountType === AccountType.Admin
    if (!isAdmin) {
      throw new Error('You cannot delete a POS due to your account level.')
    }

    const POSIdToDelete =
      request.nextUrl.searchParams.get(POS_TO_DELETE) ?? null
    console.log('POSIdToDelete', POSIdToDelete)

    if (!POSIdToDelete) {
      throw new Error('There has been an error deleting the POS')
    }

    const deletePOSFetch = await deletePOS(+POSIdToDelete)
    // console.log('deletePOSFetch -->', deletePOSFetch)
    return NextResponse.json(
      {
        success: true,
        result: `${deletePOSFetch.name} has been successfully deleted`,
      },
      { status: 201 }
    )
  } catch (error) {
    // if prisma db error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          success: false,
          result: 'There has been a database error deleting the POS',
        },
        { status: 500 }
      )
    }
    // if app error
    return NextResponse.json(
      {
        success: false,
        result: error,
      },
      { status: 500 }
    )
  }
}
