import { headers } from "next/headers";
import Link from "next/link";
import { whopsdk } from "@/lib/whop-sdk";
import { FeedbackDashboard } from "@/components/FeedbackDashboard";
import { BackButton } from "@/components/BackButton";

export default async function DashboardPage({
	params,
}: {
	params: Promise<{ companyId: string }>;
}) {
	const { companyId } = await params;
	// Ensure the user is logged in on whop
	const headersList = await headers();
	const { userId } = await whopsdk.verifyUserToken(headersList);

	console.log("Dashboard access attempt:", { companyId, userId });

	// Check if the user has admin access to this company
	let isAdmin = false;
	try {
		const access = await whopsdk.users.checkAccess(companyId, { id: userId });
		console.log("Access check result:", access);

		isAdmin = access.access_level === "admin";
	} catch (error) {
		console.error("Error checking company access:", error);
		return (
			<div className="flex flex-col p-8 gap-4">
				<h1 className="text-4xl font-bold">Error</h1>
				<p>Unable to verify access permissions.</p>
			</div>
		);
	}

	if (!isAdmin) {
		return (
			<div className="flex flex-col p-8 gap-4">
				<h1 className="text-4xl font-bold">Access Denied</h1>
				<p>Admin access is required to view this dashboard.</p>
			</div>
		);
	}

	// Fetch user info
	const user = await whopsdk.users.retrieve(userId);
	const displayName = user.name || `@${user.username}`;

	return (
		<div className="flex flex-col p-8 gap-4">
			<div className="flex justify-between items-center gap-4">
				<BackButton />
				<h1 className="text-6xl">
					Hi <strong>{displayName}</strong>!
				</h1>
				<div></div> {/* Spacer for centering */}
			</div>

			<p className="text-lg text-muted-foreground">
				Manage feedback for your experiences.
			</p>

			<FeedbackDashboard companyId={companyId} />
		</div>
	);
}
