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
							text: "remix-shadcn-supabase-boilerplate",
							href: "https://github.com/davidculemann/remix-shadcn-supabase-boilerplate",
						},
					],
				},
			],
		},
	},
	{
		headings: [
			{ side: "left", text: "Add AI CV Generation" },
			{ side: "right", text: "In Progress", variant: "secondary" },
		],
		dotStatus: "current",
		lineDone: false,
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
];
