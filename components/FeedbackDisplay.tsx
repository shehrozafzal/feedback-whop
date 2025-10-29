'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThumbsUp, ThumbsDown, Minus } from 'lucide-react'

interface Feedback {
	id: string
	content: string
	sentiment: string | null
	createdAt: string
}

interface FeedbackDisplayProps {
	experienceId: string
}

export function FeedbackDisplay({ experienceId }: FeedbackDisplayProps) {
	const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetchFeedbacks()
	}, [experienceId])

	const fetchFeedbacks = async () => {
		try {
			const res = await fetch(`/api/feedback/fetch?experienceId=${experienceId}&visibility=visible`)
			if (res.ok) {
				const data = await res.json()
				setFeedbacks(data.feedbacks)
			}
		} catch (error) {
			console.error('Error fetching feedback:', error)
		}
		setLoading(false)
	}

	const getSentimentIcon = (sentiment: string | null) => {
		switch (sentiment) {
			case 'positive':
				return <ThumbsUp className="h-3 w-3" />
			case 'negative':
				return <ThumbsDown className="h-3 w-3" />
			default:
				return <Minus className="h-3 w-3" />
		}
	}

	const getSentimentColor = (sentiment: string | null) => {
		switch (sentiment) {
			case 'positive':
				return 'bg-green-100 text-green-800 border-green-200'
			case 'negative':
				return 'bg-red-100 text-red-800 border-red-200'
			default:
				return 'bg-yellow-100 text-yellow-800 border-yellow-200'
		}
	}

	if (loading) {
		return (
			<Card>
				<CardContent className="p-6">
					<p className="text-muted-foreground">Loading feedback...</p>
				</CardContent>
			</Card>
		)
	}

	if (feedbacks.length === 0) {
		return (
			<Card>
				<CardContent className="p-6">
					<p className="text-muted-foreground">No feedback has been approved yet. Be the first to share your thoughts!</p>
				</CardContent>
			</Card>
		)
	}

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-semibold">Community Feedback</h2>
			<div className="space-y-3">
				{feedbacks.map((feedback) => (
					<Card key={feedback.id} className="hover:shadow-sm transition-shadow">
						<CardContent className="p-4">
							<div className="flex items-start justify-between gap-4">
								<div className="flex-1">
									<p className="text-sm mb-2">{feedback.content}</p>
									<div className="flex items-center gap-2">
										{feedback.sentiment && (
											<Badge className={getSentimentColor(feedback.sentiment)}>
												{getSentimentIcon(feedback.sentiment)}
												<span className="ml-1 capitalize">{feedback.sentiment}</span>
											</Badge>
										)}
										<span className="text-xs text-muted-foreground">
											{new Date(feedback.createdAt).toLocaleDateString()}
										</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	)
}