import PageButton from "@/components/shared/page-button";
import { useCV } from "@/hooks/api-hooks/useCV";
import { formatDate } from "@/lib/dates";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { getCVDocuments } from "@/lib/supabase/documents/cvs";
import type { SupabaseOutletContext } from "@/lib/supabase/supabase";
import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { CirclePlus } from "lucide-react";
import { AnimatePresence } from "motion/react";
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
	const { cvs, createCV } = useCV({ supabase });

	function handleCreateCV() {
		createCV({
			success: (id: string) => handleOpenCV(id),
			error: (error: string) => toast.error(error ?? "Something went wrong"),
		});
	}

	const navigate = useNavigate();
	const handleOpenCV = (id: string) => navigate(`/cvs/${id}`, { viewTransition: true });

	return (
		<AnimatePresence>
			<PageButton onClick={handleCreateCV} newDocument>
				<span className="flex flex-col justify-center items-center gap-2">
					Create New CV
					<CirclePlus size={48} />
				</span>
			</PageButton>
			{cvs?.data?.map((cv: any) => (
				<PageButton
					key={cv.id}
					onClick={() => handleOpenCV(cv.id)}
					style={{ viewTransitionName: `cv-card-${cv.id}` }}
				>
					<span className="flex flex-col justify-center items-center gap-2">
						<span className="text-lg font-bold">{cv.title}</span>
						<span className="text-sm text-muted-foreground">{formatDate(cv.created_at)}</span>
					</span>
				</PageButton>
			))}
		</AnimatePresence>
	);
}

export default function CVs() {
	const { dehydratedState } = useLoaderData<typeof loader>();

	return (
		<div className="gap-4 flex flex-wrap">
			<HydrationBoundary state={dehydratedState}>
				<CVList />
			</HydrationBoundary>
		</div>
	);
}
