type Side = "left" | "right" | null | undefined;
type Status = "done" | "default" | null | undefined;
type Variant = "secondary" | "primary" | null | undefined;
type DotStatus = "done" | "default" | "error" | "current" | "custom" | null | undefined;

export type RichContent = {
	type: "paragraph" | "link" | "bold" | "italic" | "text";
	text: string;
	href?: string;
	children?: RichContent[];
};

export type Update = {
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
		content: RichContent[];
	};
};

export const timelineItems: Update[] = [
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
			content: [
				{
					type: "paragraph",
					text: "Launched the placeholder website, still lacking functionality aside from the core features of my boilerplate that I forked this from: ",
					children: [
						{
							type: "link",
							text: "easycv",
							href: "https://easycv.vercel.app/",
						},
					],
				},
			],
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
			content: [
				{
					type: "paragraph",
					text: "The current focus is on adding AI features that will allow users to create their CV in minutes. Initially, I'll be using the  ",
					children: [
						{ type: "link", text: "Vercel AI SDK", href: "https://sdk.vercel.ai/docs" },
						{
							type: "text",
							text: " for the MVP CV generation feature.",
						},
					],
				},
			],
		},
	},
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
					text: "Migrating from Remix v2 to React Router v7, this was a pain - a lot of changes with little documentation available. It had to be done sooner instead of later before react router diverges further.",
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
];
