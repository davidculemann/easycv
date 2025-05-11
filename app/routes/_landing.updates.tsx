import { TimelineBuilder, TimelineEntry } from "@/components/timeline-builder";
import { Link } from "@remix-run/react";

export default function Updates() {
	return (
		<TimelineBuilder>
			<TimelineEntry
				status="done"
				dotStatus="done"
				lineDone={true}
				leftHeading="Work Begins!"
				date="Started (12/01/2025)"
				contentSide="left"
			>
				<p>
					Launched the placeholder website, still lacking functionality aside from the core features of my
					boilerplate that I forked this from:{" "}
					<Link to="https://easycv.vercel.app/" className="text-primary underline-offset-4 hover:underline">
						easycv
					</Link>
				</p>
			</TimelineEntry>

			<TimelineEntry
				status="done"
				dotStatus="done"
				lineDone={true}
				leftHeading="Add AI CV Generation"
				date="Started (01/02/2025)"
			>
				<p>
					The current focus is on adding AI features that will allow users to create their CV in minutes.
					Initially, I'll be using the{" "}
					<Link to="https://sdk.vercel.ai/docs" className="text-primary underline-offset-4 hover:underline">
						Vercel AI SDK
					</Link>{" "}
					for the MVP CV generation feature.
				</p>
			</TimelineEntry>

			<TimelineEntry
				dotStatus="current"
				lineDone={false}
				leftHeading="User Profile Forms"
				date="Started (1/04/2025)"
			>
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
			</TimelineEntry>
		</TimelineBuilder>
	);
}
