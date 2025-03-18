import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DATE_FORMATS, formatDate } from "@/lib/dates";
import { getLastXDocuments } from "@/lib/supabase/documents/cvs";
import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { FileEdit, FilePlus, Plus } from "lucide-react";
import { useMemo, useState } from "react";

const ACTIVITY_ITEMS_LIMIT = 3;

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const { data: profile } = await supabase.from("cv_profiles").select("*").eq("user_id", user?.id).single();
	const { cvs, coverLetters } = await getLastXDocuments({ supabase, limit: ACTIVITY_ITEMS_LIMIT });
	return { user, coverLetters, cvs, profile };
}

export default function Dashboard() {
	const { coverLetters, cvs, profile } = useLoaderData<typeof loader>();
	const [activeTab, setActiveTab] = useState<string>("all");

	const activityItems = useMemo(() => {
		if (activeTab === "all") {
			return [...cvs, ...coverLetters]?.slice(0, ACTIVITY_ITEMS_LIMIT);
		}
		if (activeTab === "cvs") {
			return cvs;
		}
		if (activeTab === "cover-letters") {
			return coverLetters;
		}
	}, [activeTab, cvs, coverLetters]);

	return (
		<div className="container h-full pt-8 pb-8 px-4 sm:px-8">
			<h1 className="text-xl font-bold">Welcome{profile?.first_name ? `, ${profile?.first_name}` : ""}!</h1>
			<div className="flex flex-wrap gap-4 py-8 px-4 justify-center sm:justify-start">
				<ActionCard
					title="CVs"
					description="Create and manage your resumes"
					icon={<Icons.cv className="h-3 w-5" />}
					createLink="/api/new-cv" //TODO: this could be route, but it might have to change the url after creation
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
					viewLink="/cover-letters"
					viewLabel="View Your Cover Letters"
					count={coverLetters?.length || 0}
				/>

				<Card className="min-w-72 flex-1 flex flex-col">
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

				<Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="mb-4">
						<TabsTrigger value="all">All</TabsTrigger>
						<TabsTrigger value="cvs">CVs</TabsTrigger>
						<TabsTrigger value="cover-letters">Cover Letters</TabsTrigger>
					</TabsList>
				</Tabs>

				<Card>
					<CardContent className="p-0">
						<div className="divide-y">
							{activityItems?.length ? (
								activityItems?.map((cv) => <ActivityItem key={cv.id} cv={cv} />)
							) : (
								<div className="p-4 text-center text-sm text-muted-foreground">No activity yet</div>
							)}
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
		<Card className="min-w-72 flex-1 flex flex-col">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg">{title}</CardTitle>
					{icon}
				</div>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="pb-2 h-full">
				<div className="flex items-center justify-between text-sm">
					<span>Total {title}:</span>
					<span className="font-medium">{count}</span>
				</div>
			</CardContent>
			<CardFooter className="flex flex-col gap-2 mt-auto">
				<Button variant="outline" className="w-full" asChild>
					<Link to={viewLink}>{viewLabel}</Link>
				</Button>
				<Button className="w-full" asChild>
					<Link to={createLink}>
						<Plus className="mr-2 h-4 w-4" />
						{createLabel}
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}

interface ActivityItemProps {
	cv: {
		id: string;
		title: string;
		created_at: string;
		updated_at: string;
	};
}

export function ActivityItem({ cv }: ActivityItemProps) {
	const isUpdated = cv.updated_at !== cv.created_at;

	return (
		<Link
			to={`/cvs/${cv.id}`}
			className="block p-4 hover:bg-muted/50 rounded-md transition-colors border border-transparent hover:border-border"
		>
			<div className="flex items-center justify-between">
				<div className="font-medium truncate flex-1">{cv.title}</div>
				<div className="flex items-center gap-1.5 shrink-0">
					<span
						className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
							isUpdated
								? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
								: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
						}`}
					>
						{isUpdated ? (
							<>
								<FileEdit className="mr-1 h-3 w-3" />
								Updated
							</>
						) : (
							<>
								<FilePlus className="mr-1 h-3 w-3" />
								Created
							</>
						)}
					</span>
				</div>
			</div>
			<div className="text-sm text-muted-foreground mt-1">
				{formatDate(isUpdated ? cv.updated_at : cv.created_at, DATE_FORMATS.fullTime)}
			</div>
		</Link>
	);
}
