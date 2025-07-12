import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { BaseForm } from "../shared/base-form";
import { DynamicFieldArrayForm } from "../shared/dynamic-field-array-form";
import type { EntryFormSectionConfig } from "../shared/entry-form-section";
import { type ExperienceFormValues, experienceSchema, type FormType } from "./logic/types";

interface ExperienceFormProps {
	defaultValues: ExperienceFormValues;
	formType: FormType;
	onSubmit?: (data: ExperienceFormValues) => void;
	wasCompleted?: boolean;
	formProps?: Record<string, any>;
}

const EXPERIENCE_FORM_CONFIG: EntryFormSectionConfig = {
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
	institutionFieldName: "company",
	roleFieldName: "role",
};

const EMPTY_EXPERIENCE = {
	company: "",
	role: "",
	startDate: "",
	endDate: "",
	location: "",
	description: [""],
};

export function ExperienceForm({
	defaultValues,
	formType,
	onSubmit,
	wasCompleted,
	formProps = {},
}: ExperienceFormProps) {
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
			method="POST"
			formType={formType}
			wasCompleted={wasCompleted}
			defaultValues={defaultValues}
			onSubmit={onSubmit}
			{...formProps}
		>
			<input type="hidden" name="formType" value={formType} />
			<input type="hidden" name="experiences" value={JSON.stringify(experiences)} />
			<div className="space-y-4">
				<div>
					<h3 className="text-lg font-medium">Experience</h3>
					<p className="text-sm text-muted-foreground">Add your work experience</p>
				</div>
				<Separator />
				<DynamicFieldArrayForm
					form={form}
					arrayName="experiences"
					emptyEntry={EMPTY_EXPERIENCE}
					config={EXPERIENCE_FORM_CONFIG}
					getDisplayTitle={(exp) => exp.company}
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
