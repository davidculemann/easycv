import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { FileText, Plus } from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const { data: documents } = await supabase.from("cvs").select("*");
	const { data: profile } = await supabase.from("cv_profiles").select("*").eq("user_id", user?.id).single();

	return { user, documents, profile };
}

export default function Dashboard() {
	const { user, documents, profile } = useLoaderData<typeof loader>();
	console.log(profile);
	return (
		<div className="container h-full pt-8 pb-8 px-4 sm:px-8">
			<h1 className="text-2xl font-bold">
				Hi {profile?.first_name || "there"}, start supercharging your job search
			</h1>
			<ActionCard
				title="CVs"
				description="Create and manage your resumes"
				icon={<FileText className="h-5 w-5" />}
				createLink="/cv/new"
				createLabel="Create New CV"
				viewLink="/cv/list"
				viewLabel="View Your CVs"
				count={3}
			/>

			<ActionCard
				title="Cover Letters"
				description="Craft personalized cover letters"
				icon={<FileText className="h-5 w-5" />}
				createLink="/cover-letter/new"
				createLabel="Create New Cover Letter"
				viewLink="/cover-letter/list"
				viewLabel="View Your Cover Letters"
				count={2}
			/>
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
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg">{title}</CardTitle>
					{icon}
				</div>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="pb-2">
				<div className="flex items-center justify-between text-sm">
					<span>Total {title}</span>
					<span className="font-medium">{count}</span>
				</div>
			</CardContent>
			<CardFooter className="flex flex-col gap-2">
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
