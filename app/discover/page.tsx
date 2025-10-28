import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DiscoverPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
			<div className="max-w-4xl mx-auto px-4 py-16">
				{/* Title */}
				<h1 className="text-5xl font-bold text-gray-900 mb-6 text-center">
					Anonymous Feedback System
				</h1>
				{/* Main Description Card */}
				<Card className="text-center mb-16">
					<CardContent className="p-8">
						<CardDescription className="text-xl max-w-2xl mx-auto mb-4">
							Empower your community with anonymous feedback collection and management.
						</CardDescription>
						<p className="text-base text-muted-foreground max-w-2xl mx-auto mb-2">
							Allow members to share honest feedback, suggestions, and critiques anonymously.
							Creators can moderate submissions, analyze sentiment, and improve their communities based on real user insights.
						</p>
						<p className="text-sm text-muted-foreground max-w-2xl mx-auto">
							💡 <strong>Benefits:</strong> Build trust through anonymous communication, gather authentic feedback, and make data-driven improvements to your community experiences.
						</p>
					</CardContent>
				</Card>

				{/* Pro Tips Section */}
				<div className="grid md:grid-cols-2 gap-6 mb-10">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Encourage Participation</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								Promote anonymous feedback in your community to gather honest insights
								and improve member satisfaction.
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Act on Feedback</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								Use the analytics dashboard to identify trends and implement
								changes that benefit your community.
							</p>
						</CardContent>
					</Card>
				</div>

				<h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
					Examples of Success Stories
				</h2>

				{/* Main Content Cards */}
				<div className="grid md:grid-cols-2 gap-6">
					{/* Success Story Card 1 */}
					<Card className="flex flex-col justify-between">
						<CardContent className="p-6">
							<div>
								<CardTitle className="text-lg mb-1">
									CryptoKings
								</CardTitle>
								<p className="text-xs text-muted-foreground mb-2">
									Trading Community
								</p>
								<p className="text-muted-foreground mb-4 text-sm">
									"Grew to{" "}
									<span className="font-bold text-primary">
										2,500+ members
									</span>{" "}
									and{" "}
									<span className="font-bold text-primary">
										$18,000+/mo
									</span>{" "}
									with automated signals. Members love the real-time
									alerts!"
								</p>
							</div>
							<Button asChild className="mt-auto w-full">
								<a
									href="https://whop.com/cryptokings/?a=your_app_id"
									target="_blank"
									rel="noopener noreferrer"
								>
									Visit CryptoKings
								</a>
							</Button>
						</CardContent>
					</Card>

					{/* Success Story Card 2 */}
					<Card className="flex flex-col justify-between">
						<CardContent className="p-6">
							<div>
								<CardTitle className="text-lg mb-1">
									SignalPro
								</CardTitle>
								<p className="text-xs text-muted-foreground mb-2">
									Premium Signals
								</p>
								<p className="text-muted-foreground mb-4 text-sm">
									"Retention jumped to{" "}
									<span className="font-bold text-primary">92%</span>.
									Affiliate program brought in{" "}
									<span className="font-bold text-primary">$4,000+</span>{" "}
									last quarter."
								</p>
							</div>
							<Button asChild className="mt-auto w-full">
								<a
									href="https://whop.com/signalpro/?app=your_app_id"
									target="_blank"
									rel="noopener noreferrer"
								>
									Visit SignalPro
								</a>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}