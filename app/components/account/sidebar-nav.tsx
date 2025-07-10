import { Link, useLocation, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
	items: {
		href?: string;
		id?: string;
		title: string | React.ReactNode;
		icon: JSX.Element;
	}[];
	useNavigation?: boolean;
	onSelectItem?: (e: string) => void;
	selectedItem?: string;
}

export default function SidebarNav({
	className,
	items,
	useNavigation = true,
	onSelectItem,
	selectedItem,
	...props
}: SidebarNavProps) {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const [val, setVal] = useState(useNavigation ? pathname : selectedItem);

	const handleSelect = (e: string) => {
		setVal(e);
		if (useNavigation && e) {
			navigate(e);
		}
		if (onSelectItem) {
			onSelectItem(e);
		}
	};

	return (
		<>
			<div className="p-1 md:hidden">
				<Select value={val} onValueChange={handleSelect}>
					<SelectTrigger className="h-12 sm:w-48">
						<SelectValue placeholder="Theme" />
					</SelectTrigger>
					<SelectContent>
						{items.map(({ href, id, icon, title }) => {
							const value = href ?? id!;
							return (
								<SelectItem key={value} value={value}>
									<div className="flex gap-x-4 px-2 py-1">
										<span className="scale-125">{icon}</span>
										<span className="text-md">{title}</span>
									</div>
								</SelectItem>
							);
						})}
					</SelectContent>
				</Select>
			</div>

			<div className="hidden w-full overflow-x-auto px-1 py-2 md:block">
				<nav className={cn("flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1", className)} {...props}>
					{items.map((item) =>
						item.href ? (
							<Link
								key={item.href}
								to={item.href}
								className={cn(
									buttonVariants({ variant: "ghost" }),
									pathname === item.href
										? "bg-muted hover:bg-muted"
										: "hover:bg-transparent hover:underline",
									"justify-start",
								)}
							>
								<span className="mr-2">{item.icon}</span>
								{item.title}
							</Link>
						) : (
							<Button
								key={item.id}
								onClick={() => handleSelect(item.id!)}
								variant="ghost"
								className={cn(
									buttonVariants({ variant: "ghost" }),
									selectedItem === item.id
										? "bg-muted hover:bg-muted"
										: "hover:bg-transparent hover:underline",
									"justify-start",
								)}
							>
								<span className="mr-2">{item.icon}</span>
								{item.title}
							</Button>
						),
					)}
				</nav>
			</div>
		</>
	);
}
