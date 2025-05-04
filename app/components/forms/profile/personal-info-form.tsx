import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { validatePhone } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Github, Globe, Linkedin, Mail, MapPin, Phone, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BaseForm } from "./base-form";

const personalInfoSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email address"),
	phone: z.string().refine(validatePhone, "Invalid phone number"),
	address: z.string().optional(),
	linkedin: z.string().url("Must be a valid URL").or(z.string().length(0)).optional(),
	github: z.string().url("Must be a valid URL").or(z.string().length(0)).optional(),
	website: z.string().url("Must be a valid URL").or(z.string().length(0)).optional(),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
	defaultValues: Partial<PersonalInfoFormValues>;
	onSubmit: (data: PersonalInfoFormValues) => void;
	isSubmitting?: boolean;
}

export function PersonalInfoForm({ defaultValues, onSubmit, isSubmitting }: PersonalInfoFormProps) {
	const form = useForm<PersonalInfoFormValues>({
		resolver: zodResolver(personalInfoSchema),
		defaultValues,
		mode: "onBlur",
	});

	return (
		<BaseForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting}>
			<div>
				<h3 className="text-lg font-medium mb-2">Personal Information</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>First Name</FormLabel>
									<FormControl>
										<div className="relative">
											<User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
											<Input className="pl-10" placeholder="John" {...field} />
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div>
						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Last Name</FormLabel>
									<FormControl>
										<div className="relative">
											<User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
											<Input className="pl-10" placeholder="Doe" {...field} />
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>
			</div>

			<Separator />

			<div>
				<h3 className="text-lg font-medium mb-2">Contact Information</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<div className="relative">
											<Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
											<Input
												type="email"
												className="pl-10"
												placeholder="john.doe@example.com"
												{...field}
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div>
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone</FormLabel>
									<FormControl>
										<div className="relative">
											<Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
											<Input className="pl-10" placeholder="+1 (555) 123-4567" {...field} />
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="md:col-span-2">
						<FormField
							control={form.control}
							name="address"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Address</FormLabel>
									<FormControl>
										<div className="relative">
											<MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
											<Input
												className="pl-10"
												placeholder="123 Main St, City, Country"
												{...field}
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>
			</div>

			<Separator />

			<div>
				<h3 className="text-lg font-medium mb-2">Online Presence</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<FormField
							control={form.control}
							name="linkedin"
							render={({ field }) => (
								<FormItem>
									<FormLabel>LinkedIn</FormLabel>
									<FormControl>
										<div className="relative">
											<Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
											<Input className="pl-10" placeholder="linkedin.com/in/johndoe" {...field} />
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div>
						<FormField
							control={form.control}
							name="github"
							render={({ field }) => (
								<FormItem>
									<FormLabel>GitHub</FormLabel>
									<FormControl>
										<div className="relative">
											<Github className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
											<Input className="pl-10" placeholder="github.com/johndoe" {...field} />
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="md:col-span-2">
						<FormField
							control={form.control}
							name="website"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Personal Website</FormLabel>
									<FormControl>
										<div className="relative">
											<Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
											<Input className="pl-10" placeholder="johndoe.com" {...field} />
										</div>
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
