import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { BaseForm } from "../shared/base-form";
import { BulletPoints } from "../shared/bullet-points";
import { DateField } from "../shared/date-field";
import { LocationField } from "../shared/location-field";
import { type EducationFormValues, type FormType, educationSchema } from "./logic/types";

interface EducationFormProps {
	defaultValues: EducationFormValues;
	isSubmitting?: boolean;
	formType: FormType;
	wasCompleted?: boolean;
}

const EMPTY_EDUCATION = {
	school: "",
	degree: "",
	startDate: "",
	endDate: "",
	location: "",
	description: [""],
};

export function EducationForm({ defaultValues, isSubmitting, formType, wasCompleted }: EducationFormProps) {
	const form = useForm<EducationFormValues>({
		resolver: zodResolver(educationSchema),
		defaultValues: {
			educations: defaultValues.educations?.length ? defaultValues.educations : [EMPTY_EDUCATION],
		},
		mode: "onChange",
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "educations",
	});

	const educations = form.watch("educations");

	// Keep hidden input value updated with current form data
	useEffect(() => {
		const hiddenInput = document.querySelector('input[name="educations"]') as HTMLInputElement;
		if (hiddenInput) {
			hiddenInput.value = JSON.stringify(educations);
		}
	}, [educations]);

	function onAddEducation() {
		append(EMPTY_EDUCATION);
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
			<input type="hidden" name="educations" value={JSON.stringify(educations)} />
			<div className="space-y-6">
				<div>
					<h3 className="text-lg font-medium">Education</h3>
					<p className="text-sm text-muted-foreground">Add your educational background</p>
				</div>
				<Separator />

				{fields.map((field, index) => (
					<div key={field.id} className="rounded-lg border p-4 space-y-4">
						<div className="flex justify-between items-center">
							<div className="flex items-center gap-2">
								<GraduationCap className="h-5 w-5 text-primary" />
								<h4 className="font-medium">{`Education ${index + 1}`}</h4>
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
								name={`educations.${index}.school`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Institution</FormLabel>
										<FormControl>
											<Input placeholder="University/College name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name={`educations.${index}.degree`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Degree</FormLabel>
										<FormControl>
											<Input placeholder="Degree / Field of Study" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<DateField name={`educations.${index}.startDate`} label="Start Date" />
							<DateField name={`educations.${index}.endDate`} label="End Date" />
						</div>

						<LocationField name={`educations.${index}.location`} />

						<BulletPoints
							fieldName={`educations.${index}.description`}
							label="Description"
							placeholder="Achievement or responsibility"
							bulletLabel="Add Description"
						/>
					</div>
				))}

				<Button type="button" variant="outline" onClick={onAddEducation}>
					<Plus className="mr-2 h-4 w-4" />
					Add Education
				</Button>
			</div>
		</BaseForm>
	);
}
