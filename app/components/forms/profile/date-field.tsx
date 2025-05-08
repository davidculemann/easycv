import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

export function DateField({
	name,
	label,
	placeholder = "Pick a date",
}: {
	name: string;
	label: string;
	placeholder?: string;
}) {
	return (
		<FormField
			name={name}
			render={({ field }) => (
				<FormItem className="flex flex-col">
					<FormLabel>{label}</FormLabel>
					<Popover>
						<PopoverTrigger asChild>
							<FormControl>
								<Button
									variant="outline"
									className={cn("text-left font-normal", !field.value && "text-muted-foreground")}
								>
									{field.value ? format(new Date(field.value), "PPP") : <span>{placeholder}</span>}
									<Calendar className="ml-auto h-4 w-4 opacity-50" />
								</Button>
							</FormControl>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<CalendarComponent
								mode="single"
								selected={field.value ? new Date(field.value) : undefined}
								onSelect={(date) => {
									if (date) {
										field.onChange(format(date, "yyyy-MM-dd"));
									}
								}}
								initialFocus
							/>
						</PopoverContent>
					</Popover>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
