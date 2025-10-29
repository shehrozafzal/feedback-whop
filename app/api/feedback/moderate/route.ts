import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { whopsdk } from '@/lib/whop-sdk'

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers()
    await whopsdk.verifyUserToken(headersList) // verify user
    const { feedbackId, action, sentiment } = await request.json()

    if (!feedbackId || !action) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    if (action === 'delete') {
      await prisma.feedback.delete({
        where: { id: feedbackId },
      })
    } else if (action === 'hide') {
      await prisma.feedback.update({
        where: { id: feedbackId },
        data: { visible: false },
      })
    } else if (action === 'show') {
      await prisma.feedback.update({
        where: { id: feedbackId },
        data: { visible: true },
      })
    } else if (action === 'set-sentiment') {
      if (!sentiment || !['positive', 'neutral', 'negative'].includes(sentiment)) {
        return NextResponse.json({ error: 'Invalid sentiment' }, { status: 400 })
      }
      await prisma.feedback.update({
        where: { id: feedbackId },
        data: { sentiment },
      })
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}