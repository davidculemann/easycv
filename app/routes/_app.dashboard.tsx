import type { LoaderFunctionArgs } from "react-router";
import { Link, useLoaderData, useNavigate, useOutletContext } from "react-router";
import { ArrowRight, FileEdit, FilePlus, Info, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { FormType, ParsedCVProfile } from "@/components/forms/profile/logic/types";
import { ensureValidProfile } from "@/components/forms/profile/logic/types";
import { checkSectionCompletion } from "@/components/forms/profile/logic/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DATE_FORMATS, formatDate } from "@/lib/dates";
import { createCVDocument, getLastXDocuments } from "@/lib/supabase/documents/cvs";
import { parseJsonFields } from "@/lib/supabase/documents/profile";
import type { SupabaseOutletContext } from "@/lib/supabase/supabase";
import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";

const ACTIVITY_ITEMS_LIMIT = 3;

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const {
		data: { user },
	} = await supabase.auth.getUser();

	let parsedProfile: ParsedCVProfile;
	try {
		const { data: profile } = await supabase.from("cv_profiles").select("*").eq("user_id", user?.id).single();
		parsedProfile = parseJsonFields(profile);
	} catch (error) {
		console.error("Error fetching profile:", error);
		parsedProfile = ensureValidProfile(null);
	}

	const { cvs, coverLetters, totalCvs, totalCoverLetters } = await getLastXDocuments({
		supabase,
		limit: ACTIVITY_ITEMS_LIMIT,
	});

	return {
		user,
		coverLetters,
		cvs,
		profile: parsedProfile,
		totalCvs,
		totalCoverLetters,
	};
}

type ActivityTab = "all" | "cvs" | "cover-letters";

export default function Dashboard() {
	const { coverLetters, cvs, profile, totalCvs, totalCoverLetters } = useLoaderData<typeof loader>();
	const [activeTab, setActiveTab] = useState<ActivityTab>("all");

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
					navigateLink="/cvs"
					createLabel="New CV"
					viewLink="/cvs"
					viewLabel="View CVs"
					count={totalCvs}
				/>

				<ActionCard
					title="Cover Letters"
					description="Craft personalized cover letters"
					icon={<Icons.coverLetter className="h-5 w-5" />}
					navigateLink="/cover-letters"
					createLabel="New Cover Letter"
					viewLink="/cover-letters"
					viewLabel="View Cover Letters"
					count={totalCoverLetters}
					banner={{
						variant: "warning",
						text: "A tailored cover letter can increase your interview chances by 40%",
						show: coverLetters?.length === 0,
					}}
				/>

				<ProfileCard profile={profile} icon={<Icons.profile className="h-5 w-5" />} />
			</div>

			<div>
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-semibold">Recent Activity</h2>

					<Tabs
						defaultValue="all"
						value={activeTab}
						onValueChange={(value) => setActiveTab(value as ActivityTab)}
						className="w-auto"
					>
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
								<div className="flex flex-col items-center justify-center h-full gap-2 p-6">
									<div className="text-center text-sm text-muted-foreground">No activity yet</div>
									<Link
										to={activeTab === "cover-letters" ? "/cover-letter/new" : "/api/new-cv"}
										className="w-full text-center text-sm hover:underline underline-offset-4 flex items-center justify-center gap-2"
									>
										Create your first {activeTab === "cover-letters" ? "cover letter" : "CV"}
										<Plus className="w-4 h-4" />
									</Link>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

type ProfileCardProps = {
	profile: ParsedCVProfile;
	icon: React.ReactNode;
};

export function ProfileCard({ profile, icon }: ProfileCardProps) {
	// Ensure profile is valid
	const validProfile = ensureValidProfile(profile);

	const sections: FormType[] = ["personal", "experience", "education", "projects", "skills"];
	const completed = sections.filter((section) => checkSectionCompletion(validProfile, section)).length;
	const completionPercentage = Math.round((completed / sections.length) * 100);

	return (
		<Card className="flex flex-col h-full">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg">Complete Your Profile</CardTitle>
					<div className="h-9 w-9 flex items-center justify-center rounded-full bg-primary/10 text-primary">
						{icon}
					</div>
				</div>
				<CardDescription>Finish setting up your account</CardDescription>
			</CardHeader>
			<CardContent className="pb-4 flex-1 flex flex-col justify-center">
				<div className="mb-4">
					<div className="flex justify-between items-center text-sm mb-1.5">
						<span>Profile Completion</span>
						<div className="flex items-center gap-2">
							<span className="text-primary font-medium">{completionPercentage}%</span>
						</div>
					</div>
					<Progress value={completionPercentage} className="h-2" />
				</div>
			</CardContent>
			<CardFooter>
				<Button className="w-full relative overflow-hidden group" asChild>
					<Link to="/profile">
						<div className="absolute inset-0 bg-primary/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
						<span className="relative">Continue Setup</span>
						<ArrowRight className="w-4 h-4 hover-slide-x" />
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}

interface ActionCardProps {
	title: string;
	description: string;
	icon: React.ReactNode;
	navigateLink: string;
	createLabel: string;
	viewLink: string;
	viewLabel: string;
	count: number;
	banner?: {
		variant: "warning" | "success" | "info";
		text: string;
		show: boolean;
	};
}

function ActionCard({
	title,
	description,
	icon,
	navigateLink,
	createLabel,
	viewLink,
	viewLabel,
	count,
	banner,
}: ActionCardProps) {
	const navigate = useNavigate();
	const { supabase } = useOutletContext<SupabaseOutletContext>();

	async function handleCreateNewDocument() {
		try {
			const newDocument = await createCVDocument({ supabase, cvName: "New CV", fromProfile: true });
			if ("id" in newDocument && newDocument.id) {
				navigate(`${navigateLink}/${newDocument.id}`);
			} else throw new Error("No document ID returned");
		} catch (_error) {
			toast.error("Error creating new document");
		}
	}

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
				{banner?.show && (
					<div className="mt-3 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 text-xs p-2 rounded-md flex items-start gap-2">
						<span className={`${banner.variant === "warning" ? "text-amber-500" : "text-emerald-500"}`}>
							<Info className="w-4 h-4" />
						</span>
						<span>{banner.text}</span>
					</div>
				)}
			</CardContent>
			<CardFooter className="flex flex-col gap-2 mt-auto">
				<Button variant="outline" className="w-full" asChild>
					<Link to={viewLink}>{viewLabel}</Link>
				</Button>
				<Button className="w-full" onClick={handleCreateNewDocument}>
					<Plus className="mr-2 h-4 w-4" />
					{createLabel}
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
