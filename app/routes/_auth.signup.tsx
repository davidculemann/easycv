import { Icons } from "@/components/icons";
import ConfirmOTP from "@/components/shared/confirm-otp";
import { LoadingButton } from "@/components/shared/loading-button";
import ProviderLoginButton from "@/components/shared/provider-login-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { enterLeftAnimation } from "@/lib/framer/animations";
import { forbidUser, getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import { validateEmail, validatePassword } from "@/lib/utils";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase, headers } = getSupabaseWithHeaders({ request });
	await forbidUser({ supabase, headers, redirectTo: "/dashboard" });
	return null;
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const { supabase, headers } = getSupabaseWithHeaders({ request });

	if (!validateEmail(email)) {
		throw new Response(JSON.stringify({ message: "Please enter a valid email address." }), { status: 400 });
	}

	if (!validatePassword(password)) {
		throw new Response(
			JSON.stringify({ message: "Password must be at least 8 characters long and contain at least one number." }),
			{ status: 400 },
		);
	}

	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${new URL(request.url).origin}/dashboard`,
		},
	});

	if (error) {
		throw new Response(JSON.stringify({ message: error.message }), { status: 400 });
	}

	return { message: "Check your email for the confirmation link." };
}

type ActionStatus = {
	success: boolean;
	message: string;
};

export default function SignUp() {
	const navigation = useNavigation();
	const actionData = useActionData<ActionStatus | undefined>();
	const [showOTP, _setShowOTP] = useState(false);

	useEffect(() => {
		if (actionData?.message) {
			if (actionData?.success) toast.success(actionData.message);
			if (!actionData?.success) toast.error(actionData?.message);
		}
	}, [actionData]);

	const _handleResendOTP = async () => {
		// For now, we'll just show a message since we need the email
		toast.info("Please check your email for the OTP code.");
	};

	if (showOTP) {
		return (
			<motion.div {...enterLeftAnimation} layout="position">
				<ConfirmOTP />
			</motion.div>
		);
	}

	return (
		<motion.div {...enterLeftAnimation} layout="position">
			<Form method="POST" className="mx-auto grid w-[350px] gap-6">
				<Icons.logo className="lg:hidden h-12 mx-auto" />
				<div className="grid gap-2 text-center">
					<h1 className="text-3xl font-bold">Create an account</h1>
					<p className="text-balance text-muted-foreground">Enter your email below to create your account</p>
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
					<div className="grid gap-2">
						<Label htmlFor="password">Password</Label>
						<Input id="password" type="password" name="password" autoComplete="new-password" required />
					</div>
					<LoadingButton className="w-full" loading={navigation.state === "submitting"}>
						Create account
					</LoadingButton>
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">Or continue with</span>
						</div>
					</div>
					<ProviderLoginButton provider="google" />
					<ProviderLoginButton provider="github" />
				</div>
				<div className="mt-4 text-center text-sm">
					Already have an account?
					<Link className="underline ml-2" to="/signin" prefetch="intent">
						Sign in
					</Link>
				</div>
			</Form>
		</motion.div>
	);
}
