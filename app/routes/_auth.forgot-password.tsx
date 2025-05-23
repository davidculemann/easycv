import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { enterLeftAnimation } from "@/lib/framer/animations";
import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import { validateEmail } from "@/lib/utils";
import { type ActionFunctionArgs, type MetaFunction, json } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { toast } from "sonner";

export const meta: MetaFunction = () => {
	return [{ title: "Forgot password" }];
};

type ActionResponse = { success: true; message: string } | { success: false; message: string };

export async function action({ request }: ActionFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const formData = await request.formData();
	const email = formData.get("email") as string;

	if (!validateEmail(email)) {
		return json<ActionResponse>({ success: false, message: "Invalid email address." }, { status: 400 });
	}

	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${request.headers.get("origin")}`,
	});

	if (error) {
		return json<ActionResponse>({ success: false, message: error.message }, { status: 400 });
	}

	return json<ActionResponse>({ success: true, message: "Check your email for the reset link." });
}

export default function ForgotPassword() {
	const actionData = useActionData<ActionResponse>();

	useEffect(() => {
		if (actionData?.message) {
			if (actionData?.success) toast.success(actionData.message);
			if (!actionData?.success) toast.error(actionData?.message);
		}
	}, [actionData]);

	return (
		<motion.div {...enterLeftAnimation} className="mx-auto grid w-[350px] gap-6">
			<div>
				<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
					Forgot your password?
				</h2>
				<p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
					Enter the email address associated with your account and we'll send you a link to reset your
					password.
				</p>
			</div>
			<Form className="space-y-6" method="POST">
				<div>
					<Label htmlFor="email" className="sr-only">
						Email address
					</Label>
					<Input
						id="email"
						name="email"
						type="email"
						autoComplete="email"
						required
						placeholder="Email address"
					/>
				</div>
				<Button type="submit" className="w-full">
					Reset
				</Button>
			</Form>
			<div className="flex justify-center">
				<Link to="/signin" className="underline ml-2 text-sm">
					Back to sign in
				</Link>
			</div>
		</motion.div>
	);
}
