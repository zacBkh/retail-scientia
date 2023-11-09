import { NextRequest, NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET(request: Request) {
  const currentSession = await getServerSession(authOptions)

  return NextResponse.json(
    {
      success: true,
      result: `You successfully retrieved the current session --> ${currentSession}`,
    },
    { status: 201 }
  )
}
