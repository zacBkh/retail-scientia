import { type NextRequest, NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

import { URL_PARAMS_KEYS } from '@/constants'
const { POS_TO_DELETE } = URL_PARAMS_KEYS

import { AccountType } from '@prisma/client'

import { addNewPOS, deletePOS } from '@/services/prisma-queries'

const noAccess = {
  success: false,
  result: `You don't have access to this resource.`,
}

export async function POST(request: Request) {
  const currentSession = await getServerSession(authOptions)
  const isAdmin = currentSession?.user.accountType === AccountType.Admin
  if (!isAdmin) {
    return NextResponse.json(noAccess, { status: 201 })
  }

  const newPOS = await request.json()
  const newPOSFetch = await addNewPOS(newPOS)

  return NextResponse.json(noAccess, { status: 201 })
}

// export async function GET(request: NextRequest) {

// }

export async function PATCH(request: NextRequest) {}
export async function DELETE(request: NextRequest) {
  const currentSession = await getServerSession(authOptions)
  const isAdmin = currentSession?.user.accountType === AccountType.Admin
  if (!isAdmin) {
    return NextResponse.json(noAccess, { status: 201 })
  }

  const POSIdToDelete = request.nextUrl.searchParams.get(POS_TO_DELETE) ?? null
  console.log('POSIdToDelete', POSIdToDelete)

  if (!POSIdToDelete) {
    return NextResponse.json(
      {
        success: false,
        result: `The point of sale is missing.`,
      },
      { status: 201 }
    )
  }

  const deletePOSFetch = await deletePOS(+POSIdToDelete)
  return NextResponse.json(
    {
      success: true,
      result: `${deletePOSFetch.name} has been successfully deleted.`,
    },
    { status: 201 }
  )
}

// Send sales either by chroological order (findSalesOfUser) or by top ref sold (getSalesByBestSellerSku)
// export async function GET(request: NextRequest) {
//   try {
//     // Getting query params
//     const queryDates = request.nextUrl.searchParams.get('dates') ?? null

//     return NextResponse.json(
//       {
//         success: true,
//         result: 'filteredSalesUserByTopSeller',
//       },
//       { status: 201 }
//     )
//   } catch (error) {
//     return NextResponse.json(
//       {
//         success: false,
//         result:
//           'Something went wrong with your request, please try again later.',
//       },
//       { status: 500 }
//     )
//   }
// }
