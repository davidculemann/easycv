import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

export function BulletPoints({
	fieldName,
	label,
	placeholder,
	bulletLabel = "Add Bullet Point",
}: {
	fieldName: string;
	label: string;
	placeholder: string;
	bulletLabel?: string;
}) {
	const form = useFormContext();

	return (
		<div className="space-y-2">
			<FormLabel>{label}</FormLabel>
			{(form.watch(fieldName) || []).map((item: string, descIndex: number) => (
				<div key={`${fieldName}-${descIndex}`} className="flex gap-2 items-center">
					<FormField
						name={`${fieldName}.${descIndex}`}
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormControl>
									<Input placeholder={placeholder} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{(form.watch(fieldName) || []).length > 1 && (
						<Button
							type="button"
							variant="outline"
							size="icon"
							onClick={() => {
								const currentItems = form.getValues(fieldName) || [];
								form.setValue(
									fieldName,
									currentItems.filter((_: string, i: number) => i !== descIndex),
								);
							}}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					)}
				</div>
			))}
			<Button
				type="button"
				variant="outline"
				size="sm"
				className="mt-2"
				onClick={() => {
					const currentItems = form.getValues(fieldName) || [];
					form.setValue(fieldName, [...currentItems, ""]);
				}}
			>
				<Plus className="mr-2 h-4 w-4" />
				{bulletLabel}
			</Button>
		</div>
	);
}
