import { useFetcher } from "react-router";
import { useEffect } from "react";

export function usePrefetchLink({ page }: { page: string }) {
	const fetcher = useFetcher();

	useEffect(() => {
		fetcher.load(page);
	}, []);
}
