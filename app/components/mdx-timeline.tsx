import { getMDXComponent } from "mdx-bundler/client";
import React from "react";
import type { MDXUpdate } from "@/lib/mdx";
import { TimelineBuilder, TimelineEntry } from "./timeline-builder";

// MDX components with custom elements
const components = {
	a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
		<a {...props} className="text-primary underline-offset-4 hover:underline" />
	),
	p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
		<p {...props} className={`${props.className || ""} mb-4 last:mb-0`} />
	),
};

interface MDXTimelineProps {
	updates: MDXUpdate[];
	alternating?: boolean;
}

function TimelineUpdate({ update }: { update: MDXUpdate }) {
	const Component = React.useMemo(() => getMDXComponent(update.code), [update.code]);
	return (
		<TimelineEntry
			key={update.slug}
			status={update.frontmatter.status || "default"}
			title={update.frontmatter.title}
			startedDate={update.frontmatter.started_date}
		>
			<Component components={components} />
		</TimelineEntry>
	);
}

export function MDXTimeline({ updates, alternating = true }: MDXTimelineProps) {
	return (
		<TimelineBuilder alternating={alternating}>
			{updates.map((update) => (
				<TimelineUpdate key={update.slug} update={update} />
			))}
		</TimelineBuilder>
	);
}
