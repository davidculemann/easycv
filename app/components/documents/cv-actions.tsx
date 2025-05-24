import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/use-media-query";
import { MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";

export type Action = {
	label: string;
	icon: React.ReactNode;
	onClick: () => void;
};

export interface CVActionsProps {
	actions: Action[];
	onDelete?: () => void;
}

export default function CVActions({ actions, onDelete }: CVActionsProps) {
	const [isOpen, setIsOpen] = useState(false);
	const isMobile = useMediaQuery("(max-width: 768px)");

	if (isMobile) {
		return (
			<Drawer open={isOpen} onOpenChange={setIsOpen}>
				<DrawerTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 p-0 rounded-full"
						tabIndex={0}
						aria-label="CV Actions"
					>
						<MoreVertical className="h-5 w-5" />
					</Button>
				</DrawerTrigger>
				<DrawerContent>
					<div className="flex flex-col gap-2 p-4">
						{actions.map((action) => (
							<Button
								key={action.label}
								variant="outline"
								className="justify-start"
								onClick={() => {
									action.onClick();
									setIsOpen(false);
								}}
							>
								{action.icon}
								<span className="ml-2">{action.label}</span>
							</Button>
						))}
						{onDelete && (
							<>
								<DropdownMenuSeparator />
								<Button
									variant="destructive"
									className="justify-start mt-2"
									onClick={() => {
										onDelete();
										setIsOpen(false);
									}}
								>
									<Trash2 className="h-4 w-4 mr-2" /> Delete
								</Button>
							</>
						)}
					</div>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 p-0 rounded-full"
					tabIndex={0}
					aria-label="CV Actions"
				>
					<MoreVertical className="h-5 w-5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuGroup>
					{actions.map((action) => (
						<DropdownMenuItem key={action.label} onClick={action.onClick}>
							{action.icon}
							{action.label}
						</DropdownMenuItem>
					))}
					{onDelete && (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-red-600 focus:text-red-600 focus:bg-red-50"
								onClick={(e) => {
									e.preventDefault();
									onDelete();
								}}
							>
								<Trash2 className="h-4 w-4 mr-2" /> Delete
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
