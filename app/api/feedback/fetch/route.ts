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

		console.log("Fetch request:", { companyId, experienceId, visibility })

		if (!companyId && !experienceId) {
			return NextResponse.json({ error: 'Missing companyId or experienceId' }, { status: 400 })
		}

		let whereClause: any = {}

		if (companyId && !experienceId) {
			// ADMIN VIEW: Fetch ALL feedback for this company (across all experiences)
			console.log('Admin fetch: Getting all feedback for company:', companyId)
			whereClause.companyId = companyId
		} else if (experienceId) {
			// MEMBER VIEW: Fetch feedback only for this specific experience
			console.log('Member fetch: Getting feedback for experience:', experienceId)
			whereClause.experienceId = experienceId
		}

		// Filter by visibility if specified
		if (visibility === 'visible') {
			whereClause.visible = true
		} else if (visibility === 'hidden') {
			whereClause.visible = false
		}

		console.log('Querying feedback with whereClause:', whereClause)

		// Get feedbacks
		const feedbacks = await prisma.feedback.findMany({
			where: whereClause,
			orderBy: { createdAt: 'desc' },
		})

		console.log('Fetched feedbacks count:', feedbacks.length)

		return NextResponse.json({ feedbacks })
	} catch (error) {
		console.error('Fetch error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}