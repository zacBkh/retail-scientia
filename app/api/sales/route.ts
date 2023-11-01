import { NextRequest, NextResponse } from 'next/server'

import { addSale } from '@/services/prisma-queries'

export async function POST(request: Request) {
  const req = await request.json()
  console.log('req from API route', req)

  // const saleRegistration = addSale()

  return NextResponse.json(
    {
      success: true,
      result: `Thank you for your sale`,
    },
    { status: 201 }
  )
}
