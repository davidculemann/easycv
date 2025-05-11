import { Link } from "@remix-run/react";
import React from "react";

export type Side = "left" | "right" | null | undefined;
export type Status = "done" | "default" | null | undefined;
export type Variant = "secondary" | "primary" | null | undefined;
export type DotStatus = "done" | "default" | "error" | "current" | "custom" | null | undefined;

export type UpdateItem = {
	status?: Status;
	headings: Array<{
		side: Side;
		text: string;
		variant?: Variant;
		className?: string;
	}>;
	dotStatus: DotStatus;
	lineDone: boolean;
	content: {
		side?: Side;
		content: React.ReactNode;
	};
};

export const timelineItems: UpdateItem[] = [
	{
		status: "done",
		headings: [
			{ side: "left", text: "Work Begins!" },
			{ side: "right", text: "Started (12/01/2025)", variant: "secondary" },
		],
		dotStatus: "done",
		lineDone: true,
		content: {
			side: "left",
			content: (
				<p>
					Launched the placeholder website, still lacking functionality aside from the core features of my
					boilerplate that I forked this from:{" "}
					<Link className="text-primary underline-offset-4 hover:underline" to="https://easycv.vercel.app/">
						easycv
					</Link>
				</p>
			),
		},
	},
	{
		status: "done",
		headings: [
			{ side: "left", text: "Add AI CV Generation" },
			{ side: "right", text: "Started (01/02/2025)", variant: "secondary" },
		],
		dotStatus: "done",
		lineDone: true,
		content: {
			content: (
				<p>
					The current focus is on adding AI features that will allow users to create their CV in minutes.
					Initially, I'll be using the{" "}
					<Link className="text-primary underline-offset-4 hover:underline" to="https://sdk.vercel.ai/docs">
						Vercel AI SDK
					</Link>{" "}
					for the MVP CV generation feature.
				</p>
			),
		},
	},
	{
		headings: [
			{ side: "left", text: "User Profile Forms" },
			{ side: "right", text: "Started (1/04/2025)", variant: "secondary" },
		],
		dotStatus: "current",
		lineDone: false,
		content: {
			content: (
				<>
					<p className="mb-4">
						Building comprehensive forms to collect user information needed for CV and cover letter
						generation. This includes structured data collection for: personal information, work experience,
						education, skills, certifications, projects, and languages.
					</p>
					<p>
						Using React Hook Form with Zod validation to ensure data quality and a smooth user experience.
						The collected information will feed into the AI generation system to create more accurate and
						personalized career documents.
					</p>
				</>
			),
		},
	},
];
