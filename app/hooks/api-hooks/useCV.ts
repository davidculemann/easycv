import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { createCVDocument, deleteCVDocument, getCVDocuments } from "@/lib/supabase/documents/cvs";
import type { TypedSupabaseClient } from "@/lib/supabase/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCV = ({ supabase }: { supabase: TypedSupabaseClient }) => {
	const { data: cvs } = useQuery({
		queryKey: [QUERY_KEYS.cvs.all],
		queryFn: () => getCVDocuments({ supabase }),
	});

	const { mutate: createCV, isPending: isCreatingCV } = useMutation({
		mutationFn: () => createCVDocument({ supabase }),
		mutationKey: [QUERY_KEYS.cvs.all],
	});

	const { mutate: deleteCV, isPending: isDeletingCV } = useMutation({
		mutationFn: (id: string) => deleteCVDocument({ supabase, id }),
		mutationKey: [QUERY_KEYS.cvs.all],
	});

	return { createCV, isCreatingCV, deleteCV, isDeletingCV, cvs };
};
