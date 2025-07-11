import { MapPin } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function LocationField({ name, inputClassName = "" }: { name: string; inputClassName?: string }) {
	return (
		<FormField
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel className="text-xs font-medium text-muted-foreground">Location</FormLabel>
					<FormControl>
						<div className="relative">
							<MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input className={`pl-8 ${inputClassName}`} placeholder="City, Country" {...field} />
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
