import {
	Timeline,
	TimelineContent,
	TimelineDot,
	TimelineHeading,
	TimelineItem,
	TimelineLine,
} from "@/components/ui/timeline";
import { cn } from "@/lib/utils";
import React from "react";

export type Side = "left" | "right";
export type Status = "done" | "default";
export type Variant = "secondary" | "primary";
export type DotStatus = "done" | "default" | "error" | "current" | "custom";

export interface TimelineEntryProps {
	status?: Status;
	dotStatus: DotStatus;
	lineDone: boolean;
	leftHeading?: string;
	rightHeading?: string;
	date?: string;
	children: React.ReactNode;
	contentSide?: Side;
}

export const TimelineEntry: React.FC<TimelineEntryProps> = ({
	status = "default",
	dotStatus,
	lineDone,
	leftHeading,
	rightHeading,
	date,
	children,
	contentSide = "right",
}) => {
	const [isMobile, setIsMobile] = React.useState(false);

	React.useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		handleResize(); // Check initial window size
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const headings = [];

	if (leftHeading) {
		headings.push({ side: "left" as Side, text: leftHeading });
	}

	if (date) {
		headings.push({
			side: "right" as Side,
			text: date,
			variant: "secondary" as Variant,
		});
	} else if (rightHeading) {
		headings.push({
			side: "right" as Side,
			text: rightHeading,
		});
	}

	return (
		<TimelineItem status={status}>
			{headings.map((heading, idx) => (
				<TimelineHeading
					key={idx}
					side={isMobile ? "right" : heading.side}
					variant={heading.variant}
					className={cn(isMobile && idx > 0 && "hidden")}
				>
					{heading.text}
				</TimelineHeading>
			))}
			<TimelineDot status={dotStatus} />
			<TimelineLine done={lineDone} />
			<TimelineContent side={isMobile ? "right" : contentSide}>{children}</TimelineContent>
		</TimelineItem>
	);
};

export const TimelineBuilder: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [isMobile, setIsMobile] = React.useState(false);

	React.useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		handleResize(); // Check initial window size
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<Timeline positions={isMobile ? "left" : "center"} className="m-auto px-4 sm:px-6 lg:px-8 xl:max-w-[90rem]">
			{children}
		</Timeline>
	);
};
