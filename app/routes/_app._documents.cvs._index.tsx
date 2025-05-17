import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCV } from "@/hooks/api-hooks/useCV";
import { formatDate } from "@/lib/dates";
import { tileEntryExit } from "@/lib/framer/animations";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { createCVDocument, getCVDocuments } from "@/lib/supabase/documents/cvs";
import type { SupabaseOutletContext } from "@/lib/supabase/supabase";
import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.cvs.all],
		queryFn: () => getCVDocuments({ supabase }),
	});

	return json({ dehydratedState: dehydrate(queryClient) });
}

function CVList() {
	const { supabase } = useOutletContext<SupabaseOutletContext>();
	const { cvs } = useCV({ supabase });

	const navigate = useNavigate();

	async function handleCreateNewDocument(fromProfile?: boolean) {
		try {
			const newDocument = await createCVDocument({ supabase, cvName: "New CV", fromProfile });
			if ("id" in newDocument && newDocument.id) {
				navigate(`/cvs/${newDocument.id}`);
			} else throw new Error("No document ID returned");
		} catch (error) {
			toast.error("Error creating new document");
		}
	}

	function handleOpenCV(id: string) {
		navigate(`/cvs/${id}`, { viewTransition: true });
	}

	return (
		<AnimatePresence>
			<Card className="h-52 w-40 sm:h-64 sm:w-48 border-dashed border-muted-foreground border flex flex-col items-center justify-center gap-3">
				<div className="font-semibold text-center">Create New CV</div>
				<div className="flex flex-col gap-2 w-full px-2">
					<Button variant="outline" className="w-full" onClick={() => handleCreateNewDocument(true)}>
						From profile
					</Button>
					<Button variant="outline" className="w-full" onClick={() => handleCreateNewDocument(false)}>
						From scratch
					</Button>
				</div>
			</Card>

			{cvs?.data?.map((cv: any) => (
				<motion.div key={cv.id} {...tileEntryExit} style={{ viewTransitionName: `cv-card-${cv.id}` }}>
					<Button
						onClick={() => handleOpenCV(cv.id)}
						variant="outline"
						className={"h-52 w-40 sm:h-64 sm:w-48"}
					>
						<span className="flex flex-col justify-center items-center gap-2">
							<span className="text-lg font-bold">{cv.title}</span>
							<span className="text-sm text-muted-foreground">{formatDate(cv.created_at)}</span>
						</span>
					</Button>
				</motion.div>
			))}
		</AnimatePresence>
	);
}

export default function CVs() {
	const { dehydratedState } = useLoaderData<typeof loader>();

	return (
		<div className="gap-4 flex flex-wrap justify-center sm:justify-start">
			<HydrationBoundary state={dehydratedState}>
				<CVList />
			</HydrationBoundary>
		</div>
	);
}
