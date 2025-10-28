'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeedbackDashboardProps {
  companyId: string;
}

export function FeedbackDashboard({ companyId }: FeedbackDashboardProps) {
	const [feedbacks, setFeedbacks] = useState([])
	const [summary, setSummary] = useState({ summary: [], total: 0 })

	useEffect(() => {
		fetchFeedbacks()
		fetchSummary()
	}, [companyId])

	const fetchFeedbacks = async () => {
		const res = await fetch(`/api/feedback/fetch?companyId=${companyId}`)
		const data = await res.json()
		setFeedbacks(data.feedbacks)
	}

	const fetchSummary = async () => {
		const res = await fetch(`/api/feedback/summary?companyId=${companyId}`)
		const data = await res.json()
		setSummary(data)
	}

	const handleModerate = async (feedbackId: string, action: string) => {
		await fetch('/api/feedback/moderate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ feedbackId, action }),
		})
		fetchFeedbacks()
	}

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Feedback Summary</CardTitle>
				</CardHeader>
				<CardContent>
					<p>Total Feedbacks: {summary.total}</p>
					{summary.summary.map((s: any) => (
						<p key={s.sentiment}>{s.sentiment}: {s._count}</p>
					))}
				</CardContent>
			</Card>

			<div className="space-y-4">
				{feedbacks.map((feedback: any) => (
					<Card key={feedback.id}>
						<CardContent className="p-4">
							<p>{feedback.content}</p>
							<p className="text-sm text-muted-foreground">
								{new Date(feedback.createdAt).toLocaleString()} - {feedback.visible ? 'Visible' : 'Hidden'}
							</p>
							<div className="flex gap-2 mt-2">
								<Button
									size="sm"
									variant="outline"
									onClick={() => handleModerate(feedback.id, feedback.visible ? 'hide' : 'show')}
								>
									{feedback.visible ? 'Hide' : 'Show'}
								</Button>
								<Button
									size="sm"
									variant="destructive"
									onClick={() => handleModerate(feedback.id, 'delete')}
								>
									Delete
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</>
	);
}