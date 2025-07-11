import React from "react";
import { Link } from "react-router";

/**
 * Timeline Types
 */
export type Side = "left" | "right" | null | undefined;
export type Status = "done" | "default" | null | undefined;
export type Variant = "secondary" | "primary" | null | undefined;
export type DotStatus = "done" | "default" | "error" | "current" | "custom" | null | undefined;

/**
 * Timeline Item Component Props
 */
export interface TimelineItemProps {
	status?: Status;
	dotStatus: DotStatus;
	lineDone: boolean;
	children: React.ReactNode;
}

/**
 * Timeline Heading Component Props
 */
export interface TimelineHeadingProps {
	side: Side;
	variant?: Variant;
	className?: string;
	children: React.ReactNode;
}

/**
 * Timeline Content Component Props
 */
export interface TimelineContentProps {
	side?: Side;
	children: React.ReactNode;
}

/**
 * Update Definition
 */
export interface UpdateDef {
	status?: Status;
	dotStatus: DotStatus;
	lineDone: boolean;
	headings: Array<{
		side: Side;
		text: string;
		variant?: Variant;
		className?: string;
	}>;
	content: React.ReactNode;
	contentSide?: Side;
}

/**
 * Timeline Data
 */
export const timelineItems: UpdateDef[] = [
	{
		status: "done",
		dotStatus: "done",
		lineDone: true,
		headings: [
			{ side: "left", text: "Work Begins!" },
			{ side: "right", text: "Started (12/01/2025)", variant: "secondary" },
		],
		contentSide: "left",
		content: (
			<p>
				Launched the placeholder website, still lacking functionality aside from the core features of my
				boilerplate that I forked this from:{" "}
				<Link to="https://easycv.vercel.app/" className="text-primary underline-offset-4 hover:underline">
					easycv
				</Link>
			</p>
		),
	},
	{
		status: "done",
		dotStatus: "done",
		lineDone: true,
		headings: [
			{ side: "left", text: "Add AI CV Generation" },
			{ side: "right", text: "Started (01/02/2025)", variant: "secondary" },
		],
		content: (
			<p>
				The current focus is on adding AI features that will allow users to create their CV in minutes.
				Initially, I'll be using the{" "}
				<Link to="https://sdk.vercel.ai/docs" className="text-primary underline-offset-4 hover:underline">
					Vercel AI SDK
				</Link>{" "}
				for the MVP CV generation feature.
			</p>
		),
	},
	{
		dotStatus: "current",
		lineDone: false,
		headings: [
			{ side: "left", text: "User Profile Forms" },
			{ side: "right", text: "Started (1/04/2025)", variant: "secondary" },
		],
		content: (
			<>
				<p className="mb-4">
					Building comprehensive forms to collect user information needed for CV and cover letter generation.
					This includes structured data collection for: personal information, work experience, education,
					skills, certifications, projects, and languages.
				</p>
				<p>
					Using React Hook Form with Zod validation to ensure data quality and a smooth user experience. The
					collected information will feed into the AI generation system to create more accurate and
					personalized career documents.
				</p>
			</>
		),
	},
	/* add these:
{
		headings: [
			{ side: "left", text: "User Profile Forms" },
			{ side: "right", text: "Started (1/04/2025)", variant: "secondary" },
		],
		dotStatus: "done",
		lineDone: true,
		content: {
			content: [
				{
					type: "paragraph",
					text: "Building comprehensive forms to collect user information needed for CV and cover letter generation. This includes structured data collection for: personal information, work experience, education, skills, certifications, projects, and languages.",
				},
				{
					type: "paragraph",
					text: "Using React Hook Form with Zod validation to ensure data quality and a smooth user experience. The collected information will feed into the AI generation system to create more accurate and personalized career documents.",
				},
			],
		},
	},
	{
		headings: [
			{ side: "left", text: "Migrating from Remix to React Router v7" },
			{ side: "right", text: "Started (07/07/2025)", variant: "secondary" },
		],
		dotStatus: "done",
		lineDone: true,
		content: {
			content: [
				{
					type: "paragraph",
					text: "Migrating from Remix to React Router v7, this was a pain - a lot of changes.",
				},
			],
		},
	},
	{
		headings: [
			{ side: "left", text: "Getting it ready for launch" },
			{ side: "right", text: "Started (11/07/2025)", variant: "secondary" },
		],
		dotStatus: "current",
		lineDone: false,
		content: {
			content: [
				{
					type: "paragraph",
					text: "Last week before launch, going through some security issues and auth bugs, finalising the pricing structure and finishing off little features.",
				},
			],
		},
	},
	*/
	{
		headings: [
			{ side: "left", text: "Migrating from Remix to React Router v7" },
			{ side: "right", text: "Started (07/07/2025)", variant: "secondary" },
		],
		dotStatus: "done",
		lineDone: true,
		content: (
			<p>
				Migrating from Remix to React Router v7, this was a pain - a lot of changes, a lot of changes with
				little documentation available. It had to be done sooner instead of later before react router diverges
				further.
			</p>
		),
	},
	{
		headings: [
			{ side: "left", text: "Getting it ready for launch" },
			{ side: "right", text: "Started (11/07/2025)", variant: "secondary" },
		],
		dotStatus: "current",
		lineDone: false,
		content: (
			<p>
				Last week before launch, going through some security issues and auth bugs, finalising the pricing
				structure and finishing off little features.
			</p>
		),
	},
];
