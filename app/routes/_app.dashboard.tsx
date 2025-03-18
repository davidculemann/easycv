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
import { motion } from "motion/react";
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
		<div className="container h-full pt-10 pb-12 px-4 sm:px-8 max-w-6xl mx-auto">
			<h1 className="text-2xl font-bold mb-2">Welcome{profile?.first_name ? `, ${profile?.first_name}` : ""}</h1>
			<p className="text-muted-foreground mb-8">Manage your career documents and profile</p>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
				<ActionCard
					title="CVs"
					description="Create and manage your resumes"
					icon={<Icons.cv className="h-5 w-5" />}
					createLink="/api/new-cv"
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

				<Card className="flex flex-col">
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<CardTitle className="text-lg">Complete Your Profile</CardTitle>
							<div className="h-9 w-9 flex items-center justify-center rounded-full bg-primary/10 text-primary">
								<Icons.profile className="h-5 w-5" />
							</div>
						</div>
						<CardDescription>Finish setting up your account</CardDescription>
					</CardHeader>
					<CardContent className="pb-2 flex-1">
						<div className="space-y-2.5">
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

			<div>
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-semibold">Recent Activity</h2>

					<Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-auto">
						<TabsList>
							<TabsTrigger value="all">All</TabsTrigger>
							<TabsTrigger value="cvs">CVs</TabsTrigger>
							<TabsTrigger value="cover-letters">Cover Letters</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				<Card className="overflow-hidden">
					<CardContent className="p-0">
						<div className="divide-y">
							{activityItems?.length ? (
								activityItems?.map((cv, index) => <ActivityItem key={cv.id} cv={cv} index={index} />)
							) : (
								<div className="p-6 text-center text-sm text-muted-foreground">No activity yet</div>
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
		<Card className="flex flex-col h-full">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg">{title}</CardTitle>
					<div className="h-9 w-9 flex items-center justify-center rounded-full bg-primary/10 text-primary">
						{icon}
					</div>
				</div>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="pb-2 flex-1">
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
	index: number;
}

export function ActivityItem({ cv, index }: ActivityItemProps) {
	const isUpdated = cv.updated_at !== cv.created_at;

	return (
		<motion.div
			key={cv.id}
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				delay: index * 0.05,
				duration: 0.2,
				ease: "easeOut",
			}}
			whileHover={{ backgroundColor: "var(--muted)" }}
		>
			<Link
				to={`/cvs/${cv.id}`}
				className="block p-4 transition-colors border-l-2 border-l-transparent hover:border-l-primary"
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
		</motion.div>
	);
}
