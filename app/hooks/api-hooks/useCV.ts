import type { CVContext } from "@/lib/documents/types";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { createCVDocument, deleteCVDocument, getCVDocuments, updateCVDocument } from "@/lib/supabase/documents/cvs";
import type { TypedSupabaseClient } from "@/lib/supabase/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCV = ({ supabase, id }: { supabase: TypedSupabaseClient; id?: string }) => {
	const { data: cvs } = useQuery({
		queryKey: [QUERY_KEYS.cvs.all],
		queryFn: () => getCVDocuments({ supabase }),
	});

	const { mutate: createCV, isPending: isCreatingCV } = useMutation({
		mutationFn: async ({ success, error }: { success: (id: string) => void; error: (error: string) => void }) => {
			try {
				const data = await createCVDocument({ supabase });
				success?.(data.id);
			} catch (err) {
				if (err instanceof Error) {
					error?.(err.message);
				} else {
					error?.(String(err));
				}
			}
		},
		mutationKey: [QUERY_KEYS.cvs.all],
	});

	const { mutate: deleteCV, isPending: isDeletingCV } = useMutation({
		mutationFn: (id: string) => deleteCVDocument({ supabase, id }),
		mutationKey: [QUERY_KEYS.cvs.all],
	});

	const { mutate: updateCV, isPending: isUpdatingCV } = useMutation({
		mutationFn: ({ id, cv }: { id: string; cv: Partial<CVContext> }) => updateCVDocument({ supabase, id, cv }),
		mutationKey: [QUERY_KEYS.cvs.single, id],
	});

	return { createCV, isCreatingCV, deleteCV, isDeletingCV, cvs, updateCV, isUpdatingCV };
};
