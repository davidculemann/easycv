import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BulletPoints } from "./bullet-points";
import { DateField } from "./date-field";
import { LocationField } from "./location-field";

export interface EntryFormSectionConfig {
	institutionLabel: string;
	institutionPlaceholder: string;
	roleLabel: string;
	rolePlaceholder: string;
	startEndDateLabel: string;
	currentLabel: string;
	locationLabel: string;
	locationPlaceholder: string;
	descriptionLabel: string;
	descriptionPlaceholder: string;
	bulletLabel: string;
	asTextArea?: boolean;
	institutionFieldName: string;
	roleFieldName: string;
}

interface EntryFormSectionProps {
	form: any;
	fieldPrefix: string; // e.g. "educations.0" or "experiences.0"
	config: EntryFormSectionConfig;
	index: number;
	isCurrent: boolean;
	currentIndex: number;
}

export function EntryFormSection({ form, fieldPrefix, config, index, isCurrent, currentIndex }: EntryFormSectionProps) {
	return (
		<div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
				<FormField
					control={form.control}
					name={`${fieldPrefix}.${config.institutionFieldName}`}
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-xs font-medium text-muted-foreground">
								{config.institutionLabel}
							</FormLabel>
							<FormControl>
								<Input placeholder={config.institutionPlaceholder} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name={`${fieldPrefix}.${config.roleFieldName}`}
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-xs font-medium text-muted-foreground">
								{config.roleLabel}
							</FormLabel>
							<FormControl>
								<Input placeholder={config.rolePlaceholder} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<div className="flex flex-col md:flex-row gap-2 mb-4">
				<div className="flex flex-col gap-2.5 flex-1 min-w-0">
					<FormLabel className="text-xs font-medium text-muted-foreground">
						{config.startEndDateLabel}
					</FormLabel>
					<div className="flex items-center gap-2">
						<DateField
							name={`${fieldPrefix}.startDate`}
							inputClassName="h-9 px-1 w-full w-[120px] bg-background border-border text-foreground"
						/>
						<div
							className={cn(
								isCurrent
									? "pointer-events-none opacity-60 w-full max-w-[90px]"
									: "w-full max-w-[90px]",
							)}
						>
							<DateField
								name={`${fieldPrefix}.endDate`}
								inputClassName="h-9 px-1 w-full w-[120px] bg-background border-border text-foreground"
							/>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Checkbox
							id={`current-checkbox-${index}`}
							checked={isCurrent}
							disabled={currentIndex !== -1 && currentIndex !== index}
							onCheckedChange={(checked) => {
								form.setValue(`${fieldPrefix}.current`, checked === true, {
									shouldValidate: true,
								});
							}}
							className="border-border bg-background text-foreground"
						/>
						<label
							htmlFor={`current-checkbox-${index}`}
							className="text-xs text-foreground select-none cursor-pointer"
						>
							{config.currentLabel}
						</label>
					</div>
				</div>
				<div className="flex-1 min-w-0">
					<LocationField
						name={`${fieldPrefix}.location`}
						inputClassName="h-9 w-full bg-background border-border text-foreground"
					/>
				</div>
			</div>
			<div className="mb-2">
				<BulletPoints
					fieldName={`${fieldPrefix}.description`}
					label={config.descriptionLabel}
					placeholder={config.descriptionPlaceholder}
					bulletLabel={config.bulletLabel}
					asTextArea={config.asTextArea}
				/>
			</div>
		</div>
	);
}
