import { cn } from "@/lib/utils";
import type React from "react";

interface KbdProps {
	children: React.ReactNode;
	className?: string;
}

export function Kbd({ children, className }: KbdProps) {
	return (
		<kbd
			className={cn(
				"pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground",
				className,
			)}
		>
			{children}
		</kbd>
	);
}
