import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Form as FormUI,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getUserProfile } from "@/lib/supabase/documents/cvs";
import { getSupabaseWithHeaders, requireUser } from "@/lib/supabase/supabase.server";
import { validatePhone } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form as RemixForm, useLoaderData } from "@remix-run/react";
import { Github, Globe, Linkedin, Loader2, Mail, MapPin, Phone, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Create a schema for form validation
const profileSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email address"),
	phone: z.string().refine(validatePhone, "Invalid phone number"),
	address: z.string().optional(),
	linkedin: z.string().url("Must be a valid URL").or(z.string().length(0)).optional(),
	github: z.string().url("Must be a valid URL").or(z.string().length(0)).optional(),
	website: z.string().url("Must be a valid URL").or(z.string().length(0)).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const profile = await getUserProfile({ supabase });

	return json({ profile });
}

export default function Profile() {
	const { profile } = useLoaderData<typeof loader>();

	const defaultValues = {
		firstName: profile?.first_name || "",
		lastName: profile?.last_name || "",
		email: profile?.email || "",
		phone: profile?.phone || "",
		address: profile?.address || "",
		linkedin: profile?.linkedin || "",
		github: profile?.github || "",
		website: profile?.website || "",
	};

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues,
		mode: "onChange", // Validate on change for immediate feedback
	});

	function onSubmit(values: ProfileFormValues) {
		console.log(values);
		// Your submission logic here
	}

	// Check if form is valid and has changes
	const isValid = form.formState.isValid;
	const isDirty = form.formState.isDirty;
	const canSubmit = isValid && isDirty;

	return (
		<div>
			<CardHeader>
				<CardTitle className="text-2xl font-bold">Profile</CardTitle>
				<CardDescription>Complete your profile information to create a professional CV</CardDescription>
			</CardHeader>
			<FormUI {...form}>
				<RemixForm method="POST" onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="space-y-6">
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
														<Input
															className="pl-10"
															placeholder="+1 (555) 123-4567"
															{...field}
														/>
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
														<Input
															className="pl-10"
															placeholder="linkedin.com/in/johndoe"
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
										name="github"
										render={({ field }) => (
											<FormItem>
												<FormLabel>GitHub</FormLabel>
												<FormControl>
													<div className="relative">
														<Github className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
														<Input
															className="pl-10"
															placeholder="github.com/johndoe"
															{...field}
														/>
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
												<FormDescription>
													Share your portfolio or personal website
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						</div>
					</CardContent>
					<CardFooter className="flex justify-end border-t bg-muted/20 p-6">
						<Button type="submit" disabled={!canSubmit || form.formState.isSubmitting}>
							{form.formState.isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Saving...
								</>
							) : (
								"Save Changes"
							)}
						</Button>
					</CardFooter>
				</RemixForm>
			</FormUI>
		</div>
	);
}

export async function action({ request }: ActionFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const user = await requireUser({ supabase, headers: request.headers });
	const profile = await getUserProfile({ supabase });
	return json({ user, profile });
}
