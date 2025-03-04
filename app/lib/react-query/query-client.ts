import { MutationCache, QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: 1000 * 60,
		},
	},
	mutationCache: new MutationCache({
		onSuccess: (_data, _variables, _context, mutation) => {
			if (mutation.options.mutationKey) {
				queryClient.invalidateQueries({ queryKey: [mutation.options.mutationKey] });
			}
		},
	}),
});
