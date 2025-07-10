import { useLoaderData } from "@remix-run/react";
import { MDXTimeline } from "@/components/mdx-timeline";
import type { MDXUpdate } from "@/lib/mdx";
import { getAllUpdates } from "@/lib/mdx";

export const loader = async () => {
	const updates = await getAllUpdates();
	return { updates };
};

export default function Updates() {
	const { updates } = useLoaderData<{ updates: MDXUpdate[] }>();
	return <MDXTimeline updates={updates} />;
}
