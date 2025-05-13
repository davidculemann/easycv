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
	placeholder = "Select date",
	inputClassName = "",
}: {
	name: string;
	label?: string;
	placeholder?: string;
	inputClassName?: string;
}) {
	return (
		<FormField
			name={name}
			render={({ field }) => {
				const value = field.value ? new Date(field.value) : undefined;
				const display = value ? format(value, "MMM. yyyy") : placeholder;
				return (
					<FormItem className="flex flex-col">
						{label && <FormLabel>{label}</FormLabel>}
						<Popover>
							<PopoverTrigger asChild>
								<FormControl>
									<Button
										variant="outline"
										className={cn(
											"text-left font-normal",
											!field.value && "text-muted-foreground",
											inputClassName,
										)}
									>
										{display}
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
				);
			}}
		/>
	);
}
