import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { BaseForm } from "./base-form";
import { BulletPoints } from "./bullet-points";
import { DateField } from "./date-field";
import { LocationField } from "./location-field";
import { type ExperienceFormValues, type FormType, experienceSchema } from "./logic/types";

interface ExperienceFormProps {
	defaultValues: ExperienceFormValues;
	isSubmitting?: boolean;
	formType: FormType;
	wasCompleted?: boolean;
}

const EMPTY_EXPERIENCE = {
	company: "",
	role: "",
	startDate: "",
	endDate: "",
	location: "",
	description: [""],
};

export function ExperienceForm({ defaultValues, isSubmitting, formType, wasCompleted }: ExperienceFormProps) {
	const form = useForm<ExperienceFormValues>({
		resolver: zodResolver(experienceSchema),
		defaultValues: {
			experiences: defaultValues.experiences?.length ? defaultValues.experiences : [EMPTY_EXPERIENCE],
		},
		mode: "onChange",
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "experiences",
	});

	const experiences = form.watch("experiences");

	// Keep hidden input value updated with current form data
	useEffect(() => {
		const hiddenInput = document.querySelector('input[name="experiences"]') as HTMLInputElement;
		if (hiddenInput) {
			hiddenInput.value = JSON.stringify(experiences);
		}
	}, [experiences]);

	function onAddExperience() {
		append(EMPTY_EXPERIENCE);
	}

	return (
		<BaseForm
			form={form}
			isSubmitting={isSubmitting}
			method="post"
			formType={formType}
			wasCompleted={wasCompleted}
			defaultValues={defaultValues}
		>
			<input type="hidden" name="formType" value={formType} />
			<input type="hidden" name="experiences" value={JSON.stringify(experiences)} />
			<div className="space-y-6">
				<div>
					<h3 className="text-lg font-medium">Work Experience</h3>
					<p className="text-sm text-muted-foreground">Add your professional experience</p>
				</div>
				<Separator />

				{fields.map((field, index) => (
					<div key={field.id} className="rounded-lg border p-4 space-y-4">
						<div className="flex justify-between items-center">
							<div className="flex items-center gap-2">
								<Briefcase className="h-5 w-5 text-primary" />
								<h4 className="font-medium">{`Experience ${index + 1}`}</h4>
							</div>
							{fields.length > 1 && (
								<Button variant="outline" size="icon" type="button" onClick={() => remove(index)}>
									<Trash2 className="h-4 w-4" />
								</Button>
							)}
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<FormField
								control={form.control}
								name={`experiences.${index}.company`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Company</FormLabel>
										<FormControl>
											<Input placeholder="Company name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name={`experiences.${index}.role`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Job Title</FormLabel>
										<FormControl>
											<Input placeholder="Position / Role" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<DateField name={`experiences.${index}.startDate`} label="Start Date" />
							<DateField
								name={`experiences.${index}.endDate`}
								label="End Date"
								placeholder="Pick a date or 'Present'"
							/>
						</div>

						<LocationField name={`experiences.${index}.location`} />

						<BulletPoints
							fieldName={`experiences.${index}.description`}
							label="Responsibilities & Achievements"
							placeholder="Describe responsibilities, achievements, or technologies used"
							bulletLabel="Add Bullet Point"
						/>
					</div>
				))}

				<Button type="button" variant="outline" onClick={onAddExperience}>
					<Plus className="mr-2 h-4 w-4" />
					Add Experience
				</Button>
			</div>
		</BaseForm>
	);
}
