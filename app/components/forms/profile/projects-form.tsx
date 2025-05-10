import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { BaseForm } from "../shared/base-form";
import FormTagList from "../shared/form-tag-list";
import { type FormType, type ProjectsFormValues, projectsSchema } from "./logic/types";
interface ProjectsFormProps {
	defaultValues: ProjectsFormValues;
	isSubmitting?: boolean;
	formType: FormType;
	wasCompleted?: boolean;
}

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

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "projects",
	});

	const projects = form.watch("projects");

	// Keep hidden input value updated with current form data
	useEffect(() => {
		const hiddenInput = document.querySelector('input[name="projects"]') as HTMLInputElement;
		if (hiddenInput) {
			hiddenInput.value = JSON.stringify(projects);
		}
	}, [projects]);

	function onAddProject() {
		append(EMPTY_Project);
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
			<input type="hidden" name="projects" value={JSON.stringify(projects)} />
			<div className="space-y-6">
				<div>
					<h3 className="text-lg font-medium">Projects</h3>
					<p className="text-sm text-muted-foreground">Add your personal or professional project</p>
				</div>
				<Separator />

				{fields.map((field, index) => (
					<div key={field.id} className="rounded-lg border p-4 space-y-4">
						<div className="flex justify-between items-center">
							<div className="flex items-center gap-2">
								<Briefcase className="h-5 w-5 text-primary" />
								<h4 className="font-medium">Project</h4>
							</div>
							{fields.length > 1 && (
								<Button variant="outline" size="icon" type="button" onClick={() => remove(index)}>
									<Trash2 className="h-4 w-4" />
								</Button>
							)}
						</div>

						<FormField
							control={form.control}
							name={`projects.${index}.name`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Project name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name={`projects.${index}.description`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea placeholder="Project description" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormTagList fieldName={`projects.${index}.skills`} tagLabel="Add Skill" label="Skills" />
					</div>
				))}

				<Button type="button" variant="outline" onClick={onAddProject}>
					<Plus className="mr-2 h-4 w-4" />
					Add Project
				</Button>
			</div>
		</BaseForm>
	);
}
