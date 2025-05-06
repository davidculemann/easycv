import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, GraduationCap, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { BaseForm } from "./base-form";
import { type EducationFormValues, type FormType, educationSchema } from "./types";

interface EducationFormProps {
	defaultValues: EducationFormValues;
	isSubmitting?: boolean;
	formType: FormType;
	wasCompleted?: boolean;
}

export function EducationForm({ defaultValues, isSubmitting, formType, wasCompleted }: EducationFormProps) {
	const form = useForm<EducationFormValues>({
		resolver: zodResolver(educationSchema),
		defaultValues,
		mode: "onChange",
	});

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
			<div className="space-y-6">
				<div>
					<h3 className="text-lg font-medium">Education</h3>
					<p className="text-sm text-muted-foreground">Add your educational background</p>
				</div>
				<Separator />

				<div className="grid gap-4 md:grid-cols-2">
					<FormField
						control={form.control}
						name="school"
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
						name="degree"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Degree/Field of Study</FormLabel>
								<FormControl>
									<Input placeholder="e.g. Bachelor of Science in Computer Science" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="grid gap-4 md:grid-cols-2">
					<FormField
						control={form.control}
						name="startDate"
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
						name="endDate"
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
					name="location"
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
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Describe relevant coursework, achievements, etc."
									{...field}
									className="min-h-28"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</BaseForm>
	);
}
