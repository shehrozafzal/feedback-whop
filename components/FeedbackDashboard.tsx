'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MessageSquare, TrendingUp, Eye, EyeOff, ThumbsUp, ThumbsDown, Minus, Calendar, Filter } from "lucide-react";

interface FeedbackDashboardProps {
	companyId: string;
}

interface SummaryData {
	summary: Array<{
		sentiment: string;
		count: number;
		percentage: number;
	}>;
	total: number;
	recentCount: number;
	hiddenCount: number;
	averageSentiment: number;
	sentimentBreakdown: {
		positive: number;
		neutral: number;
		negative: number;
	};
}

export function FeedbackDashboard({ companyId }: FeedbackDashboardProps) {
	const [feedbacks, setFeedbacks] = useState([])
	const [summary, setSummary] = useState<SummaryData>({
		summary: [],
		total: 0,
		recentCount: 0,
		hiddenCount: 0,
		averageSentiment: 0,
		sentimentBreakdown: { positive: 0, neutral: 0, negative: 0 }
	})
	const [searchTerm, setSearchTerm] = useState('')
	const [filterSentiment, setFilterSentiment] = useState('all')
	const [filterVisibility, setFilterVisibility] = useState('all')
	const [sortBy, setSortBy] = useState('newest')

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

	const handleModerate = async (feedbackId: string, action: string, sentiment?: string) => {
		await fetch('/api/feedback/moderate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ feedbackId, action, sentiment }),
		})
		fetchFeedbacks()
		fetchSummary()
	}

	const filteredFeedbacks = feedbacks.filter((feedback: any) => {
		const matchesSearch = feedback.content.toLowerCase().includes(searchTerm.toLowerCase())
		const matchesSentiment = filterSentiment === 'all' || feedback.sentiment === filterSentiment
		const matchesVisibility = filterVisibility === 'all' ||
			(filterVisibility === 'visible' && feedback.visible) ||
			(filterVisibility === 'hidden' && !feedback.visible)

		return matchesSearch && matchesSentiment && matchesVisibility
	}).sort((a: any, b: any) => {
		switch (sortBy) {
			case 'newest':
				return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			case 'oldest':
				return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
			case 'sentiment':
				const order = { positive: 3, neutral: 2, negative: 1 }
				return (order[b.sentiment as keyof typeof order] || 0) - (order[a.sentiment as keyof typeof order] || 0)
			default:
				return 0
		}
	})

	const getSentimentIcon = (sentiment: string) => {
		switch (sentiment) {
			case 'positive': return <ThumbsUp className="h-4 w-4 text-green-500" />
			case 'neutral': return <Minus className="h-4 w-4 text-yellow-500" />
			case 'negative': return <ThumbsDown className="h-4 w-4 text-red-500" />
			default: return null
		}
	}

	const getSentimentColor = (sentiment: string) => {
		switch (sentiment) {
			case 'positive': return 'bg-green-100 text-green-800 border-green-200'
			case 'neutral': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
			case 'negative': return 'bg-red-100 text-red-800 border-red-200'
			default: return 'bg-gray-100 text-gray-800 border-gray-200'
		}
	}

	return (
		<div className="space-y-6">
			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
						<MessageSquare className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{summary.total}</div>
						<p className="text-xs text-muted-foreground">
							{summary.hiddenCount} hidden
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{summary.recentCount}</div>
						<p className="text-xs text-muted-foreground">
							Last 7 days
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Average Sentiment</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{summary.averageSentiment}</div>
						<p className="text-xs text-muted-foreground">
							On a -1 to 1 scale
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Sentiment Breakdown</CardTitle>
						<Filter className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="flex gap-2">
							<div className="flex items-center gap-1">
								<div className="w-2 h-2 bg-green-500 rounded-full"></div>
								<span className="text-xs">{summary.sentimentBreakdown.positive}</span>
							</div>
							<div className="flex items-center gap-1">
								<div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
								<span className="text-xs">{summary.sentimentBreakdown.neutral}</span>
							</div>
							<div className="flex items-center gap-1">
								<div className="w-2 h-2 bg-red-500 rounded-full"></div>
								<span className="text-xs">{summary.sentimentBreakdown.negative}</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Sentiment Distribution Chart */}
			<Card>
				<CardHeader>
					<CardTitle>Sentiment Distribution</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{summary.summary.map((stat) => (
							<div key={stat.sentiment} className="flex items-center gap-3">
								<div className="flex items-center gap-2 min-w-[100px]">
									{getSentimentIcon(stat.sentiment)}
									<span className="text-sm font-medium capitalize">{stat.sentiment}</span>
								</div>
								<div className="flex-1">
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className={`h-2 rounded-full ${stat.sentiment === 'positive' ? 'bg-green-500' :
												stat.sentiment === 'neutral' ? 'bg-yellow-500' : 'bg-red-500'
												}`}
											style={{ width: `${stat.percentage}%` }}
										></div>
									</div>
								</div>
								<div className="text-sm text-muted-foreground min-w-[60px]">
									{stat.count} ({stat.percentage}%)
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Filters and Search */}
			<Card>
				<CardHeader>
					<CardTitle>Feedback Management</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col sm:flex-row gap-4 mb-6">
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search feedback..."
									value={searchTerm}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>
						</div>
						<Select value={filterSentiment} onValueChange={setFilterSentiment}>
							<SelectTrigger className="w-full sm:w-[140px]">
								<SelectValue placeholder="Sentiment" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Sentiments</SelectItem>
								<SelectItem value="positive">Positive</SelectItem>
								<SelectItem value="neutral">Neutral</SelectItem>
								<SelectItem value="negative">Negative</SelectItem>
							</SelectContent>
						</Select>
						<Select value={filterVisibility} onValueChange={setFilterVisibility}>
							<SelectTrigger className="w-full sm:w-[140px]">
								<SelectValue placeholder="Visibility" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All</SelectItem>
								<SelectItem value="visible">Visible</SelectItem>
								<SelectItem value="hidden">Hidden</SelectItem>
							</SelectContent>
						</Select>
						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className="w-full sm:w-[140px]">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="newest">Newest</SelectItem>
								<SelectItem value="oldest">Oldest</SelectItem>
								<SelectItem value="sentiment">Sentiment</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Feedback List */}
					<div className="space-y-4">
						{filteredFeedbacks.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								<MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<p>No feedback found matching your filters.</p>
							</div>
						) : (
							filteredFeedbacks.map((feedback: any) => (
								<Card key={feedback.id} className="hover:shadow-md transition-shadow">
									<CardContent className="p-4">
										<div className="flex items-start justify-between gap-4">
											<div className="flex-1">
												<p className="text-sm mb-2">{feedback.content}</p>
												<div className="flex items-center gap-2 mb-3">
													<Badge className={getSentimentColor(feedback.sentiment)}>
														{getSentimentIcon(feedback.sentiment)}
														<span className="ml-1 capitalize">{feedback.sentiment}</span>
													</Badge>
													<Badge variant={feedback.visible ? "default" : "secondary"}>
														{feedback.visible ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
														{feedback.visible ? 'Visible' : 'Hidden'}
													</Badge>
												</div>
												<p className="text-xs text-muted-foreground">
													{new Date(feedback.createdAt).toLocaleString()}
												</p>
											</div>
											<div className="flex gap-2">
												<Select
													value={feedback.sentiment || ''}
													onValueChange={(value) => handleModerate(feedback.id, 'set-sentiment', value)}
												>
													<SelectTrigger className="w-32">
														<SelectValue placeholder="Set sentiment" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="positive">
															<div className="flex items-center gap-2">
																<ThumbsUp className="h-3 w-3" />
																Positive
															</div>
														</SelectItem>
														<SelectItem value="neutral">
															<div className="flex items-center gap-2">
																<Minus className="h-3 w-3" />
																Neutral
															</div>
														</SelectItem>
														<SelectItem value="negative">
															<div className="flex items-center gap-2">
																<ThumbsDown className="h-3 w-3" />
																Negative
															</div>
														</SelectItem>
													</SelectContent>
												</Select>
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
										</div>
									</CardContent>
								</Card>
							))
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}