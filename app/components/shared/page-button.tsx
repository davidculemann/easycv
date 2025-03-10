import { tileEntryExit } from "@/lib/framer/animations";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Button } from "../ui/button";

export default function PageButton({
	children,
	onClick,
	newDocument,
}: { children: React.ReactNode; onClick: () => void; newDocument?: boolean }) {
	return (
		<motion.div {...tileEntryExit}>
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
