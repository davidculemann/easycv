import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { BaseForm } from "../shared/base-form";
import { DynamicFieldArrayForm } from "../shared/dynamic-field-array-form";
import type { EntryFormSectionConfig } from "../shared/entry-form-section";
import { type FormType, type ProjectsFormValues, projectsSchema } from "./logic/types";

interface ProjectsFormProps {
	defaultValues: ProjectsFormValues;
	isSubmitting?: boolean;
	formType: FormType;
	wasCompleted?: boolean;
}

const PROJECTS_FORM_CONFIG: EntryFormSectionConfig = {
	institutionLabel: "Project Name",
	institutionPlaceholder: "Project name",
	roleLabel: "Description",
	rolePlaceholder: "Project description",
	startEndDateLabel: "",
	currentLabel: "",
	locationLabel: "Link",
	locationPlaceholder: "Project link",
	descriptionLabel: "Skills",
	descriptionPlaceholder: "Technologies used",
	bulletLabel: "Add Skill",
	asTextArea: true,
	institutionFieldName: "name",
	roleFieldName: "description",
};

const EMPTY_Project = {
	name: "",
	description: "",
	skills: [],
	link: "",
};

export function ProjectsForm({ defaultValues, isSubmitting, formType, wasCompleted }: ProjectsFormProps) {
	const form = useForm<ProjectsFormValues>({
		resolver: zodResolver(projectsSchema),
		defaultValues: {
			projects: defaultValues.projects?.length ? defaultValues.projects : [EMPTY_Project],
		},
		mode: "onChange",
	});

	const projects = form.watch("projects");

	// Keep hidden input value updated with current form data
	useEffect(() => {
		const hiddenInput = document.querySelector('input[name="projects"]') as HTMLInputElement;
		if (hiddenInput) {
			hiddenInput.value = JSON.stringify(projects);
		}
	}, [projects]);

	return (
		<BaseForm
			form={form}
			isSubmitting={isSubmitting}
			method="POST"
			formType={formType}
			wasCompleted={wasCompleted}
			defaultValues={defaultValues}
		>
			<input type="hidden" name="formType" value={formType} />
			<input type="hidden" name="projects" value={JSON.stringify(projects)} />
			<div className="space-y-4">
				<div>
					<h3 className="text-lg font-medium">Projects</h3>
					<p className="text-sm text-muted-foreground">Add your personal or professional project</p>
				</div>
				<Separator />

				<DynamicFieldArrayForm
					form={form}
					arrayName="projects"
					emptyEntry={EMPTY_Project}
					config={PROJECTS_FORM_CONFIG}
					getDisplayTitle={(proj) => proj.name}
					getDisplaySubtitle={(proj) => proj.link}
				/>
			</div>
		</BaseForm>
	);
}
