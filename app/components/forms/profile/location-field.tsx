import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

export function LocationField({ name }: { name: string }) {
	return (
		<FormField
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>Location</FormLabel>
					<FormControl>
						<div className="relative">
							<MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input className="pl-8" placeholder="City, Country" {...field} />
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
