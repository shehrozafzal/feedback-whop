import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { whopsdk } from '@/lib/whop-sdk'

export async function GET(request: NextRequest) {
  try {
    const headersList = await headers()
    const { userId } = await whopsdk.verifyUserToken(headersList)
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')

    if (!companyId) {
      return NextResponse.json({ error: 'Missing companyId' }, { status: 400 })
    }

    // Get experiences for company
    const experiences = await whopsdk.experiences.list({ company_id: companyId })
    const experienceIds = experiences.data.map((e: any) => e.id)

    // Get feedbacks
    const feedbacks = await prisma.feedback.findMany({
      where: {
        experienceId: { in: experienceIds },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ feedbacks })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}