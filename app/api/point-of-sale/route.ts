import { type NextRequest, NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

import { URL_PARAMS_KEYS } from '@/constants'
const { POS_TO_DELETE } = URL_PARAMS_KEYS

import { AccountType } from '@prisma/client'
const { Admin } = AccountType

import {
  addNewPOS,
  deletePOS,
  editPOSUserRelation,
  getPOS,
} from '@/services/prisma-queries'

import { Prisma } from '@prisma/client'

import { ConnectOrDisconnect } from '@/constants'

export async function GET(request: NextRequest) {
  try {
    const currentSession = await getServerSession(authOptions)
    const isAdmin = currentSession?.user.accountType === Admin

    if (!isAdmin || !currentSession) {
      throw new Error(
        'You cannot access this resource for authorization/authentication reason [POS].'
      )
    }

    // const userID = request.nextUrl.searchParams.get(USER_ID) ?? null

    const allPOS = await getPOS()
    return NextResponse.json(
      {
        success: true,
        result: allPOS,
      },
      { status: 201 }
    )
  } catch (error) {
    // if prisma db error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          success: false,
          result: 'There has been a server error fetching the POS.',
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

export async function POST(request: Request) {
  try {
    const currentSession = await getServerSession(authOptions)
    const isAdmin = currentSession?.user.accountType === Admin

    if (!isAdmin) {
      throw new Error('You cannot delete a POS due to your account level.')
    }

    const newPOS = await request.json()
    const newPOSFetch = await addNewPOS(newPOS)

    return NextResponse.json(
      {
        success: true,
        result: `${newPOSFetch.name} has been successfully created`,
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

interface RequestUpdatePOSUserType {
  posID: number
  userID: number
  connectOrDisconnect: ConnectOrDisconnect
}

export async function PATCH(request: NextRequest) {
  try {
    const currentSession = await getServerSession(authOptions)
    const isAdmin = currentSession?.user.accountType === Admin
    if (!isAdmin) {
      throw new Error('You cannot edit a POS due to your account level.')
    }

    const req: RequestUpdatePOSUserType = await request.json()

    if (!req.posID || !req.userID || !req.connectOrDisconnect) {
      throw new Error('You cannot edit a POS due to a server error.')
    }

    const deletePOSFetch = await editPOSUserRelation(
      req.posID,
      req.userID,
      req.connectOrDisconnect
    )

    const resultMessageDiff =
      req.connectOrDisconnect === ConnectOrDisconnect.CONNECT
        ? 'added to'
        : 'removed from'

    return NextResponse.json(
      {
        success: true,
        result: `User has successfully been ${resultMessageDiff} ${deletePOSFetch.name}`,
      },
      { status: 201 }
    )
  } catch (error) {
    // // if prisma db error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          success: false,
          result:
            'There has been a server error connecting or disconnecting the user to the POS.',
        },
        { status: 500 }
      )
    }
    // // if app error
    return NextResponse.json(
      {
        success: false,
        result: error,
      },
      { status: 500 }
    )
  }
}
export async function DELETE(request: NextRequest) {
  try {
    const currentSession = await getServerSession(authOptions)
    const isAdmin = currentSession?.user.accountType === Admin
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
