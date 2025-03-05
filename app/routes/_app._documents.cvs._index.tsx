import PageButton from "@/components/shared/page-button";
import { useCV } from "@/hooks/api-hooks/useCV";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { getCVDocuments } from "@/lib/supabase/documents/cvs";
import type { SupabaseOutletContext } from "@/lib/supabase/supabase";
import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";

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

	const handleCreateCV = () => {
		createCV();
	};

	const navigate = useNavigate();
	const handleOpenCV = (id: string) => {
		navigate(`/cvs/${id}`);
	};
	return (
		<AnimatePresence>
			<PageButton onClick={handleCreateCV}>Create New CV</PageButton>
			{cvs?.data?.map((cv: any) => (
				<PageButton key={cv.id} onClick={() => handleOpenCV(cv.id)}>
					{cv.title}
				</PageButton>
			))}
		</AnimatePresence>
	);
}

export default function CVs() {
	const { dehydratedState } = useLoaderData<typeof loader>();

	return (
		<div className="p-4  gap-4 flex flex-wrap">
			<HydrationBoundary state={dehydratedState}>
				<CVList />
			</HydrationBoundary>
		</div>
	);
}
