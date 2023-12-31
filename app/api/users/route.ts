import { NextRequest, NextResponse } from 'next/server'

import { URL_PARAMS_KEYS } from '@/constants'
const {
  USER_ID,
  BRANDS_NAME_ONLY,
  ACCOUNT_TYPE,
  POS_TO_EXCLUDE,
  USER_TO_DELETE,
} = URL_PARAMS_KEYS
import {
  getUsersPrisma,
  getUniqueBrands,
  createUser,
  deleteUser,
  updateUser,
} from '@/services/prisma-queries'

import { Prisma, AccountType } from '@prisma/client'
const { Admin } = AccountType

import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { TypeAddEditUser } from '@/components/forms/add-user/form-add-user'

export async function GET(request: NextRequest) {
  const currentSession = await getServerSession(authOptions)
  const isAdmin = currentSession?.user.accountType === Admin

  if (!isAdmin || !currentSession) {
    throw new Error(
      'You cannot access this resource for authorization/authentication reason [USERS].'
    )
  }

  const userID = request.nextUrl.searchParams.get(USER_ID) ?? null
  const specificAccTypes = request.nextUrl.searchParams.get(ACCOUNT_TYPE)

  const posToExclude = request.nextUrl.searchParams.get(POS_TO_EXCLUDE)

  const posToExcludeNumb =
    posToExclude && eval(posToExclude)
      ? posToExclude?.split(',')?.map((pos) => +pos)
      : undefined

  // If does not want unique brands but look for user
  if (!userID) {
    const allUsers = await getUsersPrisma(
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

export async function POST(request: Request) {
  try {
    const currentSession = await getServerSession(authOptions)
    const isAdmin = currentSession?.user.accountType === Admin

    if (!isAdmin) {
      throw new Error('You cannot delete a POS due to your account level.')
    }

    const newUserData = await request.json()

    // Remapping brandIDs
    const brandsIDsRemapped = newUserData.brands.map((brand: number) => ({
      id: brand,
    }))
    const newUserRemapped = {
      ...newUserData,
      brands: brandsIDsRemapped,
    }

    const newUser = await createUser(newUserRemapped)

    return NextResponse.json(
      {
        success: true,
        result: `${newUser.name} has been successfully created`,
      },
      { status: 201 }
    )
  } catch (error) {
    console.log('error ---->', error)

    // // if prisma db error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log('error', error)
      return NextResponse.json(
        {
          success: false,
          result: 'There has been a server error creating a User.',
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

interface RequestBodyEditUserTypes {
  userID: number
  userData: TypeAddEditUser
}

export async function PATCH(request: NextRequest) {
  try {
    const currentSession = await getServerSession(authOptions)
    const isAdmin = currentSession?.user.accountType === Admin
    if (!isAdmin) {
      throw new Error('You cannot edit a user due to your account level.')
    }

    const req: RequestBodyEditUserTypes = await request.json()
    console.log('req ROUTE ', req)

    if (!req.userID || !req.userData) {
      throw new Error('You cannot edit a user due to a server error.')
    }

    const updateUserQuery = await updateUser(req.userID, req.userData)

    return NextResponse.json(
      {
        success: true,
        result: `The user has been edited`,
      },
      { status: 201 }
    )
  } catch (error) {
    console.log('error', error)
    // // if prisma db error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          success: false,
          result: 'There has been a server error editing the user.',
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

    if (!isAdmin || !currentSession) {
      throw new Error('You cannot delete a user due to your account level.')
    }
    const userToDelete =
      request.nextUrl.searchParams.get(USER_TO_DELETE) ?? null
    console.log('userToDelete', userToDelete)

    if (!userToDelete) {
      throw new Error('There has been an error deleting the user')
    }

    const deleteUserQuery = await deleteUser(+userToDelete)
    return NextResponse.json(
      {
        success: true,
        result: `${deleteUserQuery.name} has been successfully deleted`,
      },
      { status: 201 }
    )
  } catch (error) {
    console.log('error', error)
    // if prisma db error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          success: false,
          result: 'There has been a server error deleting the user',
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
