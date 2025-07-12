import { zodResolver } from "@hookform/resolvers/zod";
import { Github, Globe, Linkedin } from "lucide-react";
import { useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { BaseForm } from "../shared/base-form";
import { type FormType, type PersonalInfoFormValues, personalInfoSchema } from "./logic/types";

interface PersonalInfoFormProps {
	defaultValues: PersonalInfoFormValues;
	formType: FormType;
	onSubmit?: (data: PersonalInfoFormValues) => void;
	wasCompleted?: boolean;
	formProps?: Record<string, any>;
}

export function PersonalInfoForm({
	defaultValues,
	formType,
	onSubmit,
	wasCompleted,
	formProps = {},
}: PersonalInfoFormProps) {
	const form = useForm<PersonalInfoFormValues>({
		resolver: zodResolver(personalInfoSchema),
		defaultValues,
		mode: "onChange",
	});

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
			<div className="w-full max-w-2xl mx-auto space-y-4">
				<div>
					<h3 className="text-lg font-medium">Personal Information</h3>
					<p className="text-sm text-muted-foreground">Update your personal details</p>
				</div>
				<Separator />

				<div>
					<FormLabel className="text-xs font-medium text-muted-foreground">Name</FormLabel>
					<div className="grid gap-4 md:grid-cols-2">
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-xs font-medium text-muted-foreground">
										First Name
									</FormLabel>
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
									<FormLabel className="text-xs font-medium text-muted-foreground">
										Last Name
									</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>
				<Separator />
				<div>
					<h4 className="text-base font-medium text-foreground mb-1">Contact Information</h4>
					<div className="grid gap-4 md:grid-cols-2">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-xs font-medium text-muted-foreground">Email</FormLabel>
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
									<FormLabel className="text-xs font-medium text-muted-foreground">Phone</FormLabel>
									<FormControl>
										<Input
											type="tel"
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
									<FormLabel className="text-xs font-medium text-muted-foreground">Address</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>
				<Separator />
				<div>
					<h4 className="text-base font-medium text-foreground mb-1">Online Presence</h4>
					<div className="grid gap-4 md:grid-cols-2">
						<FormField
							control={form.control}
							name="linkedin"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
										<Linkedin className="h-4 w-4" /> LinkedIn
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
									<FormLabel className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
										<Github className="h-4 w-4" /> GitHub
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
									<FormLabel className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
										<Globe className="h-4 w-4" /> Personal Website
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
			</div>
		</BaseForm>
	);
}
