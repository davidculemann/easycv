import { Input } from "@/components/ui/input";
import { getUserProfile } from "@/lib/supabase/documents/cvs";
import { getSupabaseWithHeaders, requireUser } from "@/lib/supabase/supabase.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useForm } from "@tanstack/react-form";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const profile = await getUserProfile({ supabase });

	return json({ profile });
}

export default function Profile() {
	const { profile } = useLoaderData<typeof loader>();

	const form = useForm({
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			address: "",
			linkedin: "",
			github: "",
			website: "",
			// summary: "",
			// skills: "",
			// experience: "",
			// education: "",
		},
		onSubmit: async ({ value }) => {
			// Do something with form data
			console.log(value);
		},
	});

	return (
		<Form method="POST" onSubmit={() => form.handleSubmit()}>
			<form.Field name="firstName">
				{(field) => {
					return (
						<Input
							name="firstName"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
					);
				}}
			</form.Field>
			<form.Field name="lastName">
				{(field) => {
					return (
						<Input
							name="lastName"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
					);
				}}
			</form.Field>
			<form.Field name="email">
				{(field) => {
					return (
						<Input
							name="email"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
					);
				}}
			</form.Field>
			<form.Field name="phone">
				{(field) => {
					return (
						<Input
							name="phone"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
					);
				}}
			</form.Field>
			<form.Field name="address">
				{(field) => {
					return (
						<Input
							name="address"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
					);
				}}
			</form.Field>
			<form.Field name="linkedin">
				{(field) => {
					return (
						<Input
							name="linkedin"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
					);
				}}
			</form.Field>
			<form.Field name="github">
				{(field) => {
					return (
						<Input
							name="github"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
					);
				}}
			</form.Field>
			<form.Field name="website">
				{(field) => {
					return (
						<Input
							name="website"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
					);
				}}
			</form.Field>
			<form.Subscribe selector={(formState) => [formState.canSubmit, formState.isSubmitting]}>
				{([canSubmit, isSubmitting]) => (
					<button type="submit" disabled={!canSubmit}>
						{isSubmitting ? "..." : "Submit"}
					</button>
				)}
			</form.Subscribe>
		</Form>
	);
}

export async function action({ request }: ActionFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const user = await requireUser({ supabase, headers: request.headers });
	const profile = await getUserProfile({ supabase });
	return json({ user, profile });
}
