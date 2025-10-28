import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
	return (
		<div className="py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-4xl font-bold mb-4">
							Anonymous Feedback System
						</CardTitle>
						<CardDescription className="text-lg max-w-2xl mx-auto">
							A Whop microapp that allows community members to submit anonymous feedback, suggestions, and critiques directly from experience pages. Creators can moderate and analyze feedback in their dashboard.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid md:grid-cols-2 gap-6">
							<div className="text-center">
								<h3 className="text-xl font-semibold mb-2">For Members</h3>
								<p className="text-muted-foreground">
									Visit any experience page to leave anonymous feedback and help improve the community.
								</p>
							</div>
							<div className="text-center">
								<h3 className="text-xl font-semibold mb-2">For Creators</h3>
								<p className="text-muted-foreground">
									Access your admin dashboard to moderate feedback, view analytics, and manage community insights.
								</p>
							</div>
						</div>
						<div className="text-center">
							<p className="text-sm text-muted-foreground">
								Navigate to any experience page to start using the feedback system.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
