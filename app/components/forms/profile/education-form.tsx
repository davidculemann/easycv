import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BaseForm } from "../shared/base-form";
import { DynamicFieldArrayForm } from "../shared/dynamic-field-array-form";
import type { EntryFormSectionConfig } from "../shared/entry-form-section";
import { type EducationFormValues, type FormType, educationSchema } from "./logic/types";

interface EducationFormProps {
	defaultValues: EducationFormValues;
	isSubmitting?: boolean;
	formType: FormType;
	wasCompleted?: boolean;
}

const EDUCATION_FORM_CONFIG: EntryFormSectionConfig = {
	institutionLabel: "Institution",
	institutionPlaceholder: "University/College name",
	roleLabel: "Degree",
	rolePlaceholder: "Degree / Field of Study",
	startEndDateLabel: "Start & End Date",
	currentLabel: "I am currently studying here",
	locationLabel: "Location",
	locationPlaceholder: "City, Country",
	descriptionLabel: "Description",
	descriptionPlaceholder: "Achievement or responsibility",
	bulletLabel: "Add Description",
	asTextArea: true,
	institutionFieldName: "school",
	roleFieldName: "degree",
};

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

	const educations = form.watch("educations");

	// Keep hidden input value updated with current form data
	useEffect(() => {
		const hiddenInput = document.querySelector('input[name="educations"]') as HTMLInputElement;
		if (hiddenInput) {
			hiddenInput.value = JSON.stringify(educations);
		}
	}, [educations]);

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
			<div className="space-y-4">
				<div>
					<h3 className="text-lg font-medium">Education</h3>
					<p className="text-sm text-muted-foreground">Add your educational background</p>
				</div>
				<DynamicFieldArrayForm
					form={form}
					arrayName="educations"
					emptyEntry={EMPTY_EDUCATION}
					config={EDUCATION_FORM_CONFIG}
					getDisplayTitle={(edu) => edu.school}
					getDisplaySubtitle={(edu, start, end, isCurrent) =>
						edu.degree
							? `${edu.degree}${start && (isCurrent || end) ? ` • ${start} - ${isCurrent ? "Current" : end}` : ""}`
							: start && (isCurrent || end)
								? `${start} - ${isCurrent ? "Current" : end}`
								: ""
					}
					dateFormat={(date) =>
						date ? new Date(date).toLocaleString("en-US", { month: "short", year: "numeric" }) : ""
					}
				/>
			</div>
		</BaseForm>
	);
}
