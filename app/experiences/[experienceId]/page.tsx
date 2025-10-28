import { Button } from "@/components/ui/button";
import { headers } from "next/headers";
import Link from "next/link";
import { whopsdk } from "@/lib/whop-sdk";
import { FeedbackForm } from "@/components/FeedbackForm";

export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	const { experienceId } = await params;
	// Ensure the user is logged in on whop.
	const { userId } = await whopsdk.verifyUserToken(await headers());

	// Fetch the neccessary data we want from whop.
	const [experience, user, access] = await Promise.all([
		whopsdk.experiences.retrieve(experienceId),
		whopsdk.users.retrieve(userId),
		whopsdk.users.checkAccess(experienceId, { id: userId }),
	]);

	const displayName = user.name || `@${user.username}`;

	// Check if user has admin access level
	let isAdmin = false;
	if ((access as any).access_level === 'admin') {
		isAdmin = true;
	} else if ((access as any).access_level === 'customer') {
		isAdmin = false;
	}

	return (
		<div className="flex flex-col p-8 gap-4">
			<div className="flex justify-between items-center gap-4">
				<h1 className="text-6xl">
					Hi <strong>{displayName}</strong>!
				</h1>
				<div className="flex gap-2">
					{isAdmin && (
						<Link href={`/dashboard/${experience.company.id}`}>
							<Button variant="outline">
								Admin Dashboard
							</Button>
						</Link>
					)}
				</div>
			</div>

			<p className="text-lg text-muted-foreground">
				Share your anonymous feedback and help improve this community experience.
			</p>

			<FeedbackForm experienceId={experienceId} />
		</div>
	);
}

function JsonViewer({ data }: { data: any }) {
	return (
		<pre className="text-sm border rounded-lg p-4 bg-muted max-h-72 overflow-y-auto">
			<code className="text-muted-foreground">{JSON.stringify(data, null, 2)}</code>
		</pre>
	);
}
