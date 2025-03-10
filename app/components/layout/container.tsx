import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	fullWidth?: boolean;
}

export function Container({ children, fullWidth = false, className, ...props }: ContainerProps) {
	return (
		<div className={cn("h-full", !fullWidth && "container pt-8 pb-8 px-4 sm:px-8", className)} {...props}>
			{children}
		</div>
	);
}
