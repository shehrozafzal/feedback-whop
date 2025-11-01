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

		console.log('Summary for company:', { companyId, experienceCount: experienceIds.length })

		// Return empty summary if no experiences
		if (!experienceIds || experienceIds.length === 0) {
			return NextResponse.json({
				summary: [],
				total: 0,
				recentCount: 0,
				hiddenCount: 0,
				averageSentiment: 0,
				sentimentBreakdown: {
					positive: 0,
					neutral: 0,
					negative: 0,
				}
			})
		}

		// Get summary with sentiment counts - using companyId directly
		const summary = await prisma.feedback.groupBy({
			by: ['sentiment'],
			where: {
				companyId: companyId,
				visible: true,
				sentiment: { not: null },
			},
			_count: true,
		})

		const total = await prisma.feedback.count({
			where: {
				companyId: companyId,
				visible: true,
			},
		})

		// Get recent feedback (last 7 days)
		const sevenDaysAgo = new Date()
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

		const recentCount = await prisma.feedback.count({
			where: {
				companyId: companyId,
				visible: true,
				createdAt: { gte: sevenDaysAgo },
			},
		})

		// Get total hidden feedback
		const hiddenCount = await prisma.feedback.count({
			where: {
				companyId: companyId,
				visible: false,
			},
		})

		// Calculate sentiment percentages
		const sentimentStats = summary.map((s: any) => ({
			sentiment: s.sentiment,
			count: s._count,
			percentage: total > 0 ? Math.round((s._count / total) * 100) : 0,
		}))

		// Calculate average sentiment score (positive=1, neutral=0, negative=-1)
		const sentimentScoreMap: { [key: string]: number } = {
			positive: 1,
			neutral: 0,
			negative: -1,
		}

		let totalScore = 0
		let scoredFeedbacks = 0

		summary.forEach((s: any) => {
			if (sentimentScoreMap[s.sentiment] !== undefined) {
				totalScore += sentimentScoreMap[s.sentiment] * s._count
				scoredFeedbacks += s._count
			}
		})

		const averageSentiment = scoredFeedbacks > 0 ? (totalScore / scoredFeedbacks).toFixed(2) : '0.00'

		return NextResponse.json({
			summary: sentimentStats,
			total,
			recentCount,
			hiddenCount,
			averageSentiment: parseFloat(averageSentiment),
			sentimentBreakdown: {
				positive: sentimentStats.find((s: any) => s.sentiment === 'positive')?.count || 0,
				neutral: sentimentStats.find((s: any) => s.sentiment === 'neutral')?.count || 0,
				negative: sentimentStats.find((s: any) => s.sentiment === 'negative')?.count || 0,
			}
		})
	} catch (error) {
		console.error(error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}