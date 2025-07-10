import { useEffect } from "react";
import { useFetcher } from "react-router";

export function usePrefetchLink({ page }: { page: string }) {
	const fetcher = useFetcher();

	useEffect(() => {
		fetcher.load(page);
	}, []);
}
