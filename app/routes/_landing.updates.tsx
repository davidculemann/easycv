import { MDXTimeline } from "@/components/mdx-timeline";
import type { MDXUpdate } from "@/lib/mdx";
import { getAllUpdates } from "@/lib/mdx";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async () => {
	const updates = await getAllUpdates();
	return json({ updates });
};

export default function Updates() {
	const { updates } = useLoaderData<{ updates: MDXUpdate[] }>();
	return <MDXTimeline updates={updates} />;
}
