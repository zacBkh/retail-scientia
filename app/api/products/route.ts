import { NextRequest, NextResponse } from 'next/server'

import { findSpecificProducts } from '@/services/prisma-queries'

export async function POST(request: Request) {
  const req = await request.json()

  const specificProducts = await findSpecificProducts(req.productIDs)

  return NextResponse.json(
    {
      success: true,
      result: specificProducts,
    },
    { status: 201 }
  )
}
