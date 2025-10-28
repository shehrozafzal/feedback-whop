import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { whopsdk } from '@/lib/whop-sdk'

export async function GET(request: NextRequest) {
  try {
    const headersList = await headers()
    await whopsdk.verifyUserToken(headersList)
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')

    if (!companyId) {
      return NextResponse.json({ error: 'Missing companyId' }, { status: 400 })
    }

    // Get experiences for company
    const experiences = await whopsdk.experiences.list({ company_id: companyId })
    const experienceIds = experiences.data.map((e: any) => e.id)

    // Get summary
    const summary = await prisma.feedback.groupBy({
      by: ['sentiment'],
      where: {
        experienceId: { in: experienceIds },
        visible: true,
        sentiment: { not: null },
      },
      _count: true,
    })

    const total = await prisma.feedback.count({
      where: {
        experienceId: { in: experienceIds },
        visible: true,
      },
    })

    return NextResponse.json({ summary, total })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}