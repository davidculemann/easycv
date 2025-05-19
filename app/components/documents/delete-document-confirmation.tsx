import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "../ui/button";
type DeleteDocumentConfirmationProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onDelete: () => void;
	children: React.ReactNode;
	documentType: "CV" | "Cover Letter";
};

export default function DeleteDocumentConfirmation({
	open,
	onOpenChange,
	onDelete,
	children,
	documentType,
}: DeleteDocumentConfirmationProps) {
	return (
		<Popover open={open} onOpenChange={onOpenChange}>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent className="flex flex-col gap-3">
				<span className="text-sm font-medium">Delete this {documentType}?</span>
				<span className="text-sm text-muted-foreground">This action cannot be undone.</span>
				<div className="flex items-center gap-2 justify-end">
					<Button variant="outline" size="sm" className="gap-2" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button variant="destructive" size="sm" className="gap-2" onClick={onDelete}>
						Delete {documentType}
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
