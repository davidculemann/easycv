import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BaseForm } from "../shared/base-form";
import { DynamicFieldArrayForm } from "../shared/dynamic-field-array-form";
import type { EntryFormSectionConfig } from "../shared/entry-form-section";
import { type ExperienceFormValues, type FormType, experienceSchema } from "./logic/types";

interface ExperienceFormProps {
	defaultValues: ExperienceFormValues;
	isSubmitting?: boolean;
	formType: FormType;
	wasCompleted?: boolean;
}

const experienceConfig: EntryFormSectionConfig = {
	institutionLabel: "Employer",
	institutionPlaceholder: "Employer",
	roleLabel: "Job Title",
	rolePlaceholder: "Job title",
	startEndDateLabel: "Start & End Date",
	currentLabel: "I currently work here",
	locationLabel: "Location",
	locationPlaceholder: "City, Country",
	descriptionLabel: "Responsibilities & Achievements",
	descriptionPlaceholder: "Describe responsibilities, achievements, or technologies used",
	bulletLabel: "Add Bullet Point",
	asTextArea: true,
};

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

	const experiences = form.watch("experiences");

	useEffect(() => {
		const hiddenInput = document.querySelector('input[name="experiences"]') as HTMLInputElement;
		if (hiddenInput) {
			hiddenInput.value = JSON.stringify(experiences);
		}
	}, [experiences]);

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
			<div className="space-y-4">
				<div>
					<h3 className="text-lg font-medium">Experience</h3>
					<p className="text-sm text-muted-foreground">Add your work experience</p>
				</div>
				<DynamicFieldArrayForm
					form={form}
					arrayName="experiences"
					emptyEntry={EMPTY_EXPERIENCE}
					config={experienceConfig}
					getDisplayTitle={(exp) => exp.institution}
					getDisplaySubtitle={(exp, start, end, isCurrent) =>
						exp.role
							? `${exp.role}${start && (isCurrent || end) ? ` • ${start} - ${isCurrent ? "Current" : end}` : ""}`
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
