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
export type Status = "done" | "current" | "default" | "error";

export interface TimelineEntryProps {
	status: Status;
	title: string;
	startedDate: string;
	children: React.ReactNode;
	contentSide?: Side;
}

export const TimelineEntry: React.FC<TimelineEntryProps> = ({
	status,
	title,
	startedDate,
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

	// Map status to line completion
	const lineDone = status === "done";

	// Format the display date
	const displayDate = `${startedDate ? `Started (${startedDate})` : ""}`;

	const headings = [
		{ side: "left" as Side, text: title },
		{ side: "right" as Side, text: displayDate, variant: "secondary" as const },
	];

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
			<TimelineDot status={status} />
			<TimelineLine done={lineDone} />
			<TimelineContent side={isMobile ? "right" : contentSide}>{children}</TimelineContent>
		</TimelineItem>
	);
};

export interface TimelineBuilderProps {
	children: React.ReactNode;
	alternating?: boolean;
}

export const TimelineBuilder: React.FC<TimelineBuilderProps> = ({ children, alternating = false }) => {
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

	// Apply alternating sides to each TimelineEntry child
	const childrenWithAlternatingSides = React.Children.map(children, (child, index) => {
		if (!alternating || !React.isValidElement(child)) {
			return child;
		}

		// Apply alternating sides (even indexes left, odd indexes right)
		const side = index % 2 === 0 ? "left" : "right";

		// Clone the child and add the content side prop
		return React.cloneElement(child, {
			...child.props,
			contentSide: side,
		});
	});

	return (
		<Timeline positions={isMobile ? "left" : "center"} className="m-auto px-4 sm:px-6 lg:px-8 xl:max-w-[90rem]">
			{alternating ? childrenWithAlternatingSides : children}
		</Timeline>
	);
};
