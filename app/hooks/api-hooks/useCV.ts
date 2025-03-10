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

	return { createCV, isCreatingCV, deleteCV, isDeletingCV, cvs };
};
