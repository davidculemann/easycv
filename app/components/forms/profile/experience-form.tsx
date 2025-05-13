import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { BaseForm } from "../shared/base-form";
import { BulletPoints } from "../shared/bullet-points";
import { DateField } from "../shared/date-field";
import { LocationField } from "../shared/location-field";
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

	useEffect(() => {
		const hiddenInput = document.querySelector('input[name="experiences"]') as HTMLInputElement;
		if (hiddenInput) {
			hiddenInput.value = JSON.stringify(experiences);
		}
	}, [experiences]);

	function onAddExperience() {
		append(EMPTY_EXPERIENCE);
	}

	//expansion logic
	const [openItemId, setOpenItemId] = useState<string | undefined>();
	const prevFieldsLength = useRef(fields.length);

	useEffect(() => {
		if (fields.length > prevFieldsLength.current) {
			const lastId = fields[fields.length - 1]?.id;
			if (lastId) setOpenItemId(lastId);
		}
		prevFieldsLength.current = fields.length;
	}, [fields]);

	const currentIndex = experiences.findIndex((exp) => exp.current);

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

				<Accordion
					type="single"
					collapsible
					className="w-full"
					value={openItemId}
					onValueChange={setOpenItemId}
				>
					{fields.map((field, index) => {
						const exp = experiences[index] || {};
						const startDate = exp.startDate ? format(new Date(exp.startDate), "MMM. yyyy") : "";
						const endDate = exp.endDate ? format(new Date(exp.endDate), "MMM. yyyy") : "";
						const isCurrent = !!exp.current;

						return (
							<AccordionItem
								key={field.id}
								value={field.id}
								className="bg-card rounded-lg border shadow-sm mb-6"
							>
								<AccordionTrigger className="px-4 cursor-pointer select-none rounded-t-lg hover:bg-muted/50 gap-2">
									<div className="flex flex-col text-left w-full">
										<div className="font-medium text-base">
											{exp.company || (
												<span className="text-muted-foreground">New Experience</span>
											)}
										</div>
										<div className="text-xs text-muted-foreground">
											{exp.role ? `${exp.role}` : ""}
											{startDate && (isCurrent || endDate)
												? ` • ${startDate} - ${isCurrent ? "Current" : endDate}`
												: ""}
										</div>
									</div>
									{fields.length > 1 && (
										<div
											role="button"
											tabIndex={0}
											aria-label="Delete experience"
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
											name={`experiences.${index}.role`}
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-xs font-medium text-muted-foreground">
														Job Title
													</FormLabel>
													<FormControl>
														<Input placeholder="Job title" className="h-9" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`experiences.${index}.company`}
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-xs font-medium text-muted-foreground">
														Employer
													</FormLabel>
													<FormControl>
														<Input placeholder="Employer" className="h-9" {...field} />
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
													name={`experiences.${index}.startDate`}
													inputClassName="h-9 px-1 text-xs w-full w-[100px] bg-background border-border text-foreground"
												/>
												<div
													className={cn(
														isCurrent
															? "pointer-events-none opacity-60 w-full max-w-[90px]"
															: "w-full max-w-[90px]",
													)}
												>
													<DateField
														name={`experiences.${index}.endDate`}
														inputClassName="h-9 px-1 text-xs w-full w-[100px] bg-background border-border text-foreground"
													/>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<Checkbox
													id={`current-checkbox-${index}`}
													checked={isCurrent}
													disabled={currentIndex !== -1 && currentIndex !== index}
													onCheckedChange={(checked) => {
														form.setValue(
															`experiences.${index}.current`,
															checked === true,
															{
																shouldValidate: true,
															},
														);
													}}
													className="border-border bg-background text-foreground"
												/>
												<label
													htmlFor={`current-checkbox-${index}`}
													className="text-xs text-foreground select-none cursor-pointer"
												>
													I currently work here
												</label>
											</div>
										</div>
										<div className="flex-1 min-w-0">
											<LocationField
												name={`experiences.${index}.location`}
												inputClassName="h-9 w-full bg-background border-border text-foreground"
											/>
										</div>
									</div>

									<div className="mb-2">
										<BulletPoints
											fieldName={`experiences.${index}.description`}
											label="Responsibilities & Achievements"
											placeholder="Describe responsibilities, achievements, or technologies used"
											bulletLabel="Add Bullet Point"
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
					onClick={onAddExperience}
					className="w-full max-w-md mx-auto flex items-center justify-center"
				>
					<Plus className="mr-2 h-4 w-4" />
					Add Work Experience
				</Button>
			</div>
		</BaseForm>
	);
}
