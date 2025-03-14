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
}: {
	children: React.ReactNode;
	onClick: () => void;
	newDocument?: boolean;
	style?: React.CSSProperties;
	animate?: boolean;
}) {
	return (
		<motion.div {...(animate && tileEntryExit)} style={style}>
			<Button
				onClick={onClick}
				variant="outline"
				className={cn("h-64 w-48", newDocument && "border-dashed border-muted-foreground bg-muted")}
			>
				{children}
			</Button>
		</motion.div>
	);
}
