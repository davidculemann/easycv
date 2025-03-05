import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { createCV, getCVs } from "@/lib/supabase/documents/cvs";
import type { TypedSupabaseClient } from "@/lib/supabase/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useCV = ({ supabase }: { supabase: TypedSupabaseClient }) => {
	const { data: cvs } = useQuery({
		queryKey: [QUERY_KEYS.cvs.all],
		queryFn: () => getCVs({ supabase }),
	});

	const { mutate: createNewCV, isPending: isCreatingCV } = useMutation({
		mutationFn: () => createCV({ supabase }),
		mutationKey: [QUERY_KEYS.cvs.all],
	});

	const { mutate: deleteCV, isPending: isDeletingCV } = useMutation({
		mutationFn: (id: string) => axios.delete(`/api/cv/${id}`),
		mutationKey: [QUERY_KEYS.cvs.all],
	});

	return { createNewCV, isCreatingCV, deleteCV, isDeletingCV, cvs };
};
