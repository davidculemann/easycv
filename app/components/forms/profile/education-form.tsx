import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar, GraduationCap, MapPin, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { BaseForm } from "./base-form";
import { type EducationFormValues, type FormType, educationSchema } from "./types";

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

	const { fields, append, remove } = useFieldArray({ control: form.control, name: "educations" });

	const educations = form.watch("educations");

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
							<FormField
								control={form.control}
								name={`educations.${index}.startDate`}
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Start Date</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn(
															"text-left font-normal",
															!field.value && "text-muted-foreground",
														)}
													>
														{field.value ? (
															format(new Date(field.value), "PPP")
														) : (
															<span>Pick a date</span>
														)}
														<Calendar className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<CalendarComponent
													mode="single"
													selected={field.value ? new Date(field.value) : undefined}
													onSelect={(date) => {
														if (date) {
															field.onChange(format(date, "yyyy-MM-dd"));
														}
													}}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name={`educations.${index}.endDate`}
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>End Date</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn(
															"text-left font-normal",
															!field.value && "text-muted-foreground",
														)}
													>
														{field.value ? (
															format(new Date(field.value), "PPP")
														) : (
															<span>Pick a date</span>
														)}
														<Calendar className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<CalendarComponent
													mode="single"
													selected={field.value ? new Date(field.value) : undefined}
													onSelect={(date) => {
														if (date) {
															field.onChange(format(date, "yyyy-MM-dd"));
														}
													}}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name={`educations.${index}.location`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Location</FormLabel>
									<FormControl>
										<div className="relative">
											<MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
											<Input className="pl-8" placeholder="City, Country" {...field} />
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="space-y-2">
							<FormLabel>Description</FormLabel>
							{form.watch(`educations.${index}.description`)?.map((_, descIndex) => (
								<FormField
									key={`${field.id}-desc-${descIndex}`}
									control={form.control}
									name={`educations.${index}.description.${descIndex}`}
									render={({ field: descField }) => (
										<FormItem>
											<FormControl>
												<Input placeholder="Achievement or responsibility" {...descField} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							))}
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="mt-2"
								onClick={() => {
									const currentDesc = form.getValues(`educations.${index}.description`) || [];
									form.setValue(`educations.${index}.description`, [...currentDesc, ""]);
								}}
							>
								<Plus className="mr-2 h-4 w-4" />
								Add Description
							</Button>
						</div>
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
