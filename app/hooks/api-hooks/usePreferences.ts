import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { editPreferences, getPreferences } from "@/lib/supabase/documents/preferences";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Database } from "db_types";

export function usePreferences({ supabase, id }: { supabase: SupabaseClient<Database>; id?: string }) {
	const queryClient = useQueryClient();

	const { data: preferences, isLoading: isLoadingPreferences } = useQuery({
		queryKey: [QUERY_KEYS.preferences, id],
		queryFn: () => getPreferences({ supabase, id }),
		enabled: !!id,
	});

	const { mutate: updatePreferences, isPending: isUpdatingPreferences } = useMutation({
		mutationFn: (update: Partial<Database["public"]["Tables"]["preferences"]["Update"]>) =>
			editPreferences({ supabase, preferences: update, id }),
		onMutate: async (update) => {
			await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.preferences, id] });
			const previous = queryClient.getQueryData([QUERY_KEYS.preferences, id]);
			queryClient.setQueryData([QUERY_KEYS.preferences, id], {
				...(previous ?? {}),
				...update,
			});
			return { previous };
		},
		onError: (_err, _update, context) => {
			if (context?.previous) {
				queryClient.setQueryData([QUERY_KEYS.preferences, id], context.previous);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.preferences, id] });
		},
	});

	return { isLoadingPreferences, isUpdatingPreferences, preferences, updatePreferences };
}
