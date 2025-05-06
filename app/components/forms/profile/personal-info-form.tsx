import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Github, Globe, Linkedin } from "lucide-react";
import { useForm } from "react-hook-form";
import { BaseForm } from "./base-form";
import { type FormType, type PersonalInfoFormValues, personalInfoSchema } from "./types";

interface PersonalInfoFormProps {
	defaultValues: PersonalInfoFormValues;
	isSubmitting?: boolean;
	formType: FormType;
	wasCompleted?: boolean;
}

export function PersonalInfoForm({ defaultValues, isSubmitting, formType, wasCompleted }: PersonalInfoFormProps) {
	const form = useForm<PersonalInfoFormValues>({
		resolver: zodResolver(personalInfoSchema),
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
					<h3 className="text-lg font-medium">Personal Information</h3>
					<p className="text-sm text-muted-foreground">Update your personal details</p>
				</div>
				<Separator />
				<div className="grid gap-4 md:grid-cols-2">
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>First Name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="lastName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Last Name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div>
					<h3 className="text-lg font-medium">Contact Information</h3>
					<p className="text-sm text-muted-foreground">Update your contact details</p>
				</div>
				<Separator />
				<div className="grid gap-4 md:grid-cols-2">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type="email" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone</FormLabel>
								<FormControl>
									<Input
										type="tel"
										placeholder="Enter 10-12 digit phone number"
										{...field}
										onChange={(e) => {
											field.onChange(e);
											form.trigger("phone");
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="address"
						render={({ field }) => (
							<FormItem className="md:col-span-2">
								<FormLabel>Address</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div>
					<h3 className="text-lg font-medium">Online Presence</h3>
					<p className="text-sm text-muted-foreground">Add your professional profiles</p>
				</div>
				<Separator />
				<div className="grid gap-4 md:grid-cols-2">
					<FormField
						control={form.control}
						name="linkedin"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center gap-2">
									<Linkedin className="h-4 w-4" />
									LinkedIn
								</FormLabel>
								<FormControl>
									<Input type="url" placeholder="https://linkedin.com/in/..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="github"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center gap-2">
									<Github className="h-4 w-4" />
									GitHub
								</FormLabel>
								<FormControl>
									<Input type="url" placeholder="https://github.com/..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="website"
						render={({ field }) => (
							<FormItem className="md:col-span-2">
								<FormLabel className="flex items-center gap-2">
									<Globe className="h-4 w-4" />
									Personal Website
								</FormLabel>
								<FormControl>
									<Input type="url" placeholder="https://..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</div>
		</BaseForm>
	);
}
