import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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

	const [openItemId, setOpenItemId] = useState<string | undefined>();
	const prevFieldsLength = useRef(fields.length);

	useEffect(() => {
		if (fields.length > prevFieldsLength.current) {
			const lastId = fields[fields.length - 1]?.id;
			if (lastId) setOpenItemId(lastId);
		}
		prevFieldsLength.current = fields.length;
	}, [fields]);

	// Set first item as open by default if no item is currently open
	useEffect(() => {
		if (!openItemId && fields.length > 0) {
			setOpenItemId(fields[0]?.id);
		}
	}, [openItemId, fields]);

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

				<Accordion
					type="single"
					collapsible
					className="w-full"
					value={openItemId}
					onValueChange={setOpenItemId}
				>
					{fields.map((field, index) => {
						const proj = projects[index] || {};
						return (
							<AccordionItem
								key={field.id}
								value={field.id}
								className="bg-card rounded-lg border shadow-sm mb-6"
							>
								<AccordionTrigger className="px-4 cursor-pointer select-none rounded-t-lg hover:bg-muted/50 gap-2">
									<div className="flex flex-col text-left w-full">
										<div className="font-medium text-base">
											{proj.name || <span className="text-muted-foreground">New Project</span>}
										</div>
										<div className="text-xs text-muted-foreground">
											{proj.link && (
												<a
													href={proj.link}
													target="_blank"
													rel="noopener noreferrer"
													className="underline text-xs"
												>
													{proj.link}
												</a>
											)}
										</div>
									</div>
									{fields.length > 1 && (
										<div
											role="button"
											tabIndex={0}
											aria-label="Delete project"
											className="ml-auto flex items-center justify-center rounded-md p-2 hover:bg-muted/50 focus:bg-muted/50 cursor-pointer"
											onClick={(e) => {
												e.stopPropagation();
												remove(index);
											}}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													remove(index);
												}
											}}
										>
											<Trash2 className="h-4 w-4 text-muted-foreground" />
										</div>
									)}
								</AccordionTrigger>
								<AccordionContent className="px-4 pt-0">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
										<FormField
											control={form.control}
											name={`projects.${index}.name`}
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-xs font-medium text-muted-foreground">
														Name
													</FormLabel>
													<FormControl>
														<Input placeholder="Project name" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`projects.${index}.link`}
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-xs font-medium text-muted-foreground">
														Link
													</FormLabel>
													<FormControl>
														<Input placeholder="Project link" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="mb-2">
										<FormField
											control={form.control}
											name={`projects.${index}.description`}
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-xs font-medium text-muted-foreground">
														Description
													</FormLabel>
													<FormControl>
														<textarea
															className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
															placeholder="Project description or achievement"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<FormTagList fieldName={`projects.${index}.skills`} label="Skills" maxTags={5} />
								</AccordionContent>
							</AccordionItem>
						);
					})}
				</Accordion>

				<Button
					type="button"
					variant="outline"
					onClick={onAddProject}
					className="w-full max-w-md mx-auto flex items-center justify-center"
				>
					<Plus className="mr-2 h-4 w-4" />
					Add Project
				</Button>
			</div>
		</BaseForm>
	);
}
