import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { whopsdk } from '@/lib/whop-sdk'

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers()
    const { userId } = await whopsdk.verifyUserToken(headersList)
    const { experienceId, content } = await request.json()

    if (!experienceId || !content) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const feedback = await prisma.feedback.create({
      data: {
        experienceId,
        userId,
        content,
      },
    })

    return NextResponse.json({ success: true, feedback })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}