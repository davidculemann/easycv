import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, GraduationCap, MapPin, Plus, Trash2 } from "lucide-react";
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
			educations: defaultValues.educations || [EMPTY_EDUCATION],
		},
		mode: "onChange",
	});

	const { fields, append, remove } = useFieldArray({ control: form.control, name: "educations" });

	const educations = form.watch("educations");

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
					<div key={field.id} className="space-y-6 p-4 border rounded-lg">
						<div className="flex justify-between items-center">
							<h4 className="font-medium">Education ({index + 1})</h4>
							{fields.length > 1 && (
								<Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
									<Trash2 className="h-4 w-4" />
								</Button>
							)}
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<FormField
								control={form.control}
								{...form.register(`educations.${index}.school` as const, { required: true })}
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-2">
											<GraduationCap className="h-4 w-4" />
											School/University
										</FormLabel>
										<FormControl>
											<Input placeholder="University or school name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								{...form.register(`educations.${index}.degree` as const, { required: true })}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Degree/Field of Study</FormLabel>
										<FormControl>
											<Input
												placeholder="e.g. Bachelor of Science in Computer Science"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<FormField
								control={form.control}
								{...form.register(`educations.${index}.startDate` as const, { required: true })}
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-2">
											<Calendar className="h-4 w-4" />
											Start Date
										</FormLabel>
										<FormControl>
											<Input type="date" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								{...form.register(`educations.${index}.endDate` as const, { required: true })}
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-2">
											<Calendar className="h-4 w-4" />
											End Date (or expected)
										</FormLabel>
										<FormControl>
											<Input type="date" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							{...form.register(`educations.${index}.location` as const)}
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-2">
										<MapPin className="h-4 w-4" />
										Location
									</FormLabel>
									<FormControl>
										<Input placeholder="City, Country" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name={`educations.${index}.description`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<div className="space-y-2">
										{field.value?.map((_, bulletIndex) => (
											<div key={bulletIndex} className="flex gap-2">
												<FormControl>
													<Input
														placeholder="Enter a bullet point"
														{...form.register(
															`educations.${index}.description.${bulletIndex}` as const,
														)}
													/>
												</FormControl>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => {
														const newValue = [...(field.value || [])];
														newValue.splice(bulletIndex, 1);
														field.onChange(newValue);
													}}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										))}
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => {
												field.onChange([...(field.value || []), ""]);
											}}
										>
											<Plus className="h-4 w-4 mr-2" />
											Add Bullet Point
										</Button>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				))}
				<div className="flex flex-1 justify-end">
					<Button type="button" variant="outline" size="sm" onClick={onAddEducation}>
						<Plus className="h-4 w-4 mr-2" />
						Add Education
					</Button>
				</div>
			</div>
		</BaseForm>
	);
}
