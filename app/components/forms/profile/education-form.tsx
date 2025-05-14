import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

	const currentIndex = educations.findIndex((edu) => edu.current);

	const [openItemId, setOpenItemId] = useState<string | undefined>();
	const prevFieldsLength = useRef(fields.length);

	useEffect(() => {
		if (fields.length > prevFieldsLength.current) {
			const lastId = fields[fields.length - 1]?.id;
			if (lastId) setOpenItemId(lastId);
		}
		prevFieldsLength.current = fields.length;
	}, [fields]);

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

				<Accordion
					type="single"
					collapsible
					className="w-full"
					value={openItemId}
					onValueChange={setOpenItemId}
				>
					{fields.map((field, index) => {
						const edu = educations[index] || {};
						const startDate = edu.startDate ? new Date(edu.startDate) : undefined;
						const endDate = edu.endDate ? new Date(edu.endDate) : undefined;
						const isCurrent = !!edu.current;
						const startDateStr = startDate
							? startDate.toLocaleString("en-US", { month: "short", year: "numeric" })
							: "";
						const endDateStr = endDate
							? endDate.toLocaleString("en-US", { month: "short", year: "numeric" })
							: "";
						return (
							<AccordionItem
								key={field.id}
								value={field.id}
								className="bg-card rounded-lg border shadow-sm mb-6"
							>
								<AccordionTrigger className="px-4 cursor-pointer select-none rounded-t-lg hover:bg-muted/50 gap-2">
									<div className="flex flex-col text-left w-full">
										<div className="font-medium text-base">
											{edu.school || <span className="text-muted-foreground">New Education</span>}
										</div>
										<div className="text-xs text-muted-foreground">
											{edu.degree ? `${edu.degree}` : ""}
											{startDateStr && (isCurrent || endDateStr)
												? ` • ${startDateStr} - ${isCurrent ? "Current" : endDateStr}`
												: ""}
										</div>
									</div>
									{fields.length > 1 && (
										<div
											role="button"
											tabIndex={0}
											aria-label="Delete education"
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
											name={`educations.${index}.school`}
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-xs font-medium text-muted-foreground">
														Institution
													</FormLabel>
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
													<FormLabel className="text-xs font-medium text-muted-foreground">
														Degree
													</FormLabel>
													<FormControl>
														<Input placeholder="Degree / Field of Study" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="flex flex-col md:flex-row gap-2 mb-4">
										<div className="flex flex-col gap-2.5 flex-1 min-w-0">
											<FormLabel className="text-xs font-medium text-muted-foreground">
												Start & End Date
											</FormLabel>
											<div className="flex items-center gap-2">
												<DateField
													name={`educations.${index}.startDate`}
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
														name={`educations.${index}.endDate`}
														inputClassName="h-9 px-1 w-full w-[120px] bg-background border-border text-foreground"
													/>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<Checkbox
													id={`current-edu-checkbox-${index}`}
													checked={isCurrent}
													disabled={currentIndex !== -1 && currentIndex !== index}
													onCheckedChange={(checked) => {
														form.setValue(`educations.${index}.current`, checked === true, {
															shouldValidate: true,
														});
													}}
													className="border-border bg-background text-foreground"
												/>
												<label
													htmlFor={`current-edu-checkbox-${index}`}
													className="text-xs text-foreground select-none cursor-pointer"
												>
													I am currently studying here
												</label>
											</div>
										</div>
										<div className="flex-1 min-w-0">
											<LocationField
												name={`educations.${index}.location`}
												inputClassName="h-9 w-full bg-background border-border text-foreground"
											/>
										</div>
									</div>
									<div className="mb-2">
										<BulletPoints
											fieldName={`educations.${index}.description`}
											label="Description"
											placeholder="Achievement or responsibility"
											bulletLabel="Add Description"
											asTextArea
										/>
									</div>
								</AccordionContent>
							</AccordionItem>
						);
					})}
				</Accordion>

				<Button
					type="button"
					variant="outline"
					onClick={onAddEducation}
					className="w-full max-w-md mx-auto flex items-center justify-center"
				>
					<Plus className="mr-2 h-4 w-4" />
					Add Education
				</Button>
			</div>
		</BaseForm>
	);
}
