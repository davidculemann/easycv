import { tileEntryExit } from "@/lib/framer/animations";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Button } from "../ui/button";

export default function PageButton({
	children,
	onClick,
	newDocument,
	style,
	animate,
	type = "button",
}: {
	children: React.ReactNode;
	onClick?: () => void;
	newDocument?: boolean;
	style?: React.CSSProperties;
	animate?: boolean;
	type?: "button" | "submit" | "reset";
}) {
	return (
		<motion.div {...(animate && tileEntryExit)} style={style}>
			<Button
				type={type}
				onClick={onClick}
				variant="outline"
				className={cn(
					"h-52 w-40 sm:h-64 sm:w-48",
					newDocument && "border-dashed border-muted-foreground bg-muted",
				)}
			>
				{children}
			</Button>
		</motion.div>
	);
}
