import { Icons } from "@/components/icons";
import { LoadingButton } from "@/components/shared/loading-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { enterLeftAnimation } from "@/lib/framer/animations";
import { forbidUser, getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import { validateEmail } from "@/lib/utils";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, Link, useActionData, useNavigation } from "react-router";
import { motion } from "motion/react";
import { useEffect } from "react";
import { toast } from "sonner";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase, headers } = getSupabaseWithHeaders({ request });
	await forbidUser({ supabase, headers, redirectTo: "/dashboard" });
	return null;
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const email = formData.get("email") as string;
	const { supabase } = getSupabaseWithHeaders({ request });

	if (!validateEmail(email)) {
		return { success: false, message: "Please enter a valid email address." };
	}

	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${new URL(request.url).origin}/update-password`,
	});

	if (error) {
		return { success: false, message: error.message };
	}

	return { message: "Check your email for the reset link.", success: true };
}

type ActionStatus = {
	success: boolean;
	message: string;
};

export default function ForgotPassword() {
	const navigation = useNavigation();
	const actionData = useActionData<ActionStatus | undefined>();

	useEffect(() => {
		if (actionData?.message) {
			if (actionData?.success) toast.info(actionData.message);
			if (!actionData?.success) toast.error(actionData?.message);
		}
	}, [actionData]);

	return (
		<motion.div {...enterLeftAnimation} layout="position">
			<Form method="POST" className="mx-auto grid w-[350px] gap-6">
				<Icons.logo className="lg:hidden h-12 mx-auto" />
				<div className="grid gap-2 text-center">
					<h1 className="text-3xl font-bold">Forgot password</h1>
					<p className="text-balance text-muted-foreground">
						Enter your email address and we will send you a reset link
					</p>
				</div>
				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							name="email"
							placeholder="email@example.com"
							required
							autoComplete="email"
						/>
					</div>
					<LoadingButton className="w-full" loading={navigation.state === "submitting"}>
						Send reset link
					</LoadingButton>
				</div>
				<div className="mt-4 text-center text-sm">
					Remember your password?
					<Link to="/signin" className="underline ml-2 text-sm">
						Sign in
					</Link>
				</div>
			</Form>
		</motion.div>
	);
}
