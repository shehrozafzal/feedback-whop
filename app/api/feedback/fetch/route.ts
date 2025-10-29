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
    const experienceId = searchParams.get('experienceId')
    const visibility = searchParams.get('visibility') // 'visible', 'hidden', or null for all

    if (!companyId && !experienceId) {
      return NextResponse.json({ error: 'Missing companyId or experienceId' }, { status: 400 })
    }

    let whereClause: any = {}

    if (experienceId) {
      // Fetch feedback for specific experience
      whereClause.experienceId = experienceId
    } else {
      // Get experiences for company and fetch all feedback for those experiences
      const experiences = await whopsdk.experiences.list({ company_id: companyId! })
      const experienceIds = experiences.data.map((e: any) => e.id)
      whereClause.experienceId = { in: experienceIds }
    }

    // Filter by visibility if specified
    if (visibility === 'visible') {
      whereClause.visible = true
    } else if (visibility === 'hidden') {
      whereClause.visible = false
    }

    // Get feedbacks
    const feedbacks = await prisma.feedback.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ feedbacks })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}