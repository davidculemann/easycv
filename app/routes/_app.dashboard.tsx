import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Plus } from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const { data: coverLetters } = await supabase.from("cover_letters").select("*").eq("user_id", user?.id);
	const { data: cvs } = await supabase.from("cvs").select("*").eq("user_id", user?.id);
	const { data: profile } = await supabase.from("cv_profiles").select("*").eq("user_id", user?.id).single();

	return { user, coverLetters, cvs, profile };
}

export default function Dashboard() {
	const { user, coverLetters, cvs, profile } = useLoaderData<typeof loader>();
	console.log(profile);
	return (
		<div className="container h-full pt-8 pb-8 px-4 sm:px-8">
			<h1 className="text-xl font-bold">
				Welcome{profile?.first_name ? `, ${profile?.first_name}` : ""}! Your EasyCV Journey Starts Here
			</h1>
			<div className="flex flex-wrap gap-4 py-8 px-4 justify-center sm:justify-start">
				<ActionCard
					title="CVs"
					description="Create and manage your resumes"
					icon={<Icons.cv className="h-5 w-5" />}
					createLink="/cv/new"
					createLabel="Create New CV"
					viewLink="/cvs"
					viewLabel="View Your CVs"
					count={cvs?.length || 0}
				/>

				<ActionCard
					title="Cover Letters"
					description="Craft personalized cover letters"
					icon={<Icons.coverLetter className="h-5 w-5" />}
					createLink="/cover-letter/new"
					createLabel="Create New Cover Letter"
					viewLink="/cvs"
					viewLabel="View Your Cover Letters"
					count={coverLetters?.length || 0}
				/>

				<Card className="w-72">
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<CardTitle className="text-lg">Complete Your Profile</CardTitle>
							<Icons.profile className="h-5 w-5 text-muted-foreground" />
						</div>
						<CardDescription>Finish setting up your account</CardDescription>
					</CardHeader>
					<CardContent className="pb-2">
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span>Personal Information</span>
								<span className="text-muted-foreground">Completed</span>
							</div>
							<div className="flex justify-between text-sm">
								<span>Work Experience</span>
								<span className="text-muted-foreground">2/3 Items</span>
							</div>
							<div className="flex justify-between text-sm">
								<span>Education</span>
								<span className="text-muted-foreground">1/2 Items</span>
							</div>
							<div className="flex justify-between text-sm">
								<span>Skills & Certifications</span>
								<span className="text-muted-foreground">Not Started</span>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Button className="w-full" asChild>
							<Link to="/profile">Continue Setup</Link>
						</Button>
					</CardFooter>
				</Card>
			</div>

			<div className="mt-8">
				<h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
				<Card>
					<CardContent className="p-0">
						<div className="divide-y">
							<ActivityItem
								title="Software Engineer CV"
								description="Last edited 2 days ago"
								link="/cv/1"
							/>
							<ActivityItem
								title="Marketing Position Cover Letter"
								description="Created 3 days ago"
								link="/cover-letter/1"
							/>
							<ActivityItem
								title="Product Manager CV"
								description="Last edited 1 week ago"
								link="/cv/2"
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

interface ActionCardProps {
	title: string;
	description: string;
	icon: React.ReactNode;
	createLink: string;
	createLabel: string;
	viewLink: string;
	viewLabel: string;
	count: number;
}

function ActionCard({
	title,
	description,
	icon,
	createLink,
	createLabel,
	viewLink,
	viewLabel,
	count,
}: ActionCardProps) {
	return (
		<Card className="w-72 flex flex-col">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg">{title}</CardTitle>
					{icon}
				</div>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="pb-2 h-full">
				<div className="flex items-center justify-between text-sm">
					<span>Total {title}</span>
					<span className="font-medium">{count}</span>
				</div>
			</CardContent>
			<CardFooter className="flex flex-col gap-2 mt-auto">
				<Button className="w-full" asChild>
					<Link to={createLink}>
						<Plus className="mr-2 h-4 w-4" />
						{createLabel}
					</Link>
				</Button>
				<Button variant="outline" className="w-full" asChild>
					<Link to={viewLink}>{viewLabel}</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}

interface ActivityItemProps {
	title: string;
	description: string;
	link: string;
}

function ActivityItem({ title, description, link }: ActivityItemProps) {
	return (
		<Link to={link} className="block p-4 hover:bg-muted/50">
			<div className="font-medium">{title}</div>
			<div className="text-sm text-muted-foreground">{description}</div>
		</Link>
	);
}
