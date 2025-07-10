import { Icons } from "@/components/icons";
import ConfirmOTP from "@/components/shared/confirm-otp";
import { LoadingButton } from "@/components/shared/loading-button";
import ProviderLoginButton from "@/components/shared/provider-login-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { enterLeftAnimation } from "@/lib/framer/animations";
import { forbidUser, getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import { validateEmail, validatePassword } from "@/lib/utils";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, Link, redirect, useActionData, useFetcher, useNavigation } from "react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { createClient } from "@supabase/supabase-js";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase, headers } = getSupabaseWithHeaders({ request });
	await forbidUser({ supabase, headers, redirectTo: "/dashboard" });
	return null;
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const intent = formData.get("intent") as string;
	const { supabase, headers } = getSupabaseWithHeaders({ request });

	if (intent === "resend") {
		// Handle resend OTP
		if (!validateEmail(email)) {
			return { success: false, message: "Please enter a valid email address." };
		}

		const { error } = await supabase.auth.resend({
			type: "signup",
			email,
		});

		if (error) {
			return { success: false, message: error.message };
		}

		return { message: "OTP code resent successfully!", success: true };
	}

	if (!validateEmail(email)) {
		return { success: false, message: "Please enter a valid email address." };
	}

	if (!validatePassword(password)) {
		return {
			success: false,
			message: "Password must be at least 8 characters long and contain at least one number.",
		};
	}

	// Use the admin client to check for an existing, confirmed user.
	const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
	const {
		data: { users },
		error: listUsersError,
	} = await supabaseAdmin.auth.admin.listUsers();

	if (listUsersError) {
		return { success: false, message: "An unexpected error occurred. Please try again." };
	}

	const existingUser = users.find((user) => user.email === email);

	if (existingUser?.email_confirmed_at) {
		return { success: false, message: "An account with this email already exists." };
	}

	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${new URL(request.url).origin}/dashboard`,
		},
	});

	if (error) {
		if (error.message.includes("User already registered")) {
			return { success: false, message: "An account with this email already exists." };
		}
		return { success: false, message: error.message };
	}

	return { message: "Check your email for the OTP code.", success: true, email };
}

type ActionStatus = {
	success: boolean;
	message: string;
	email?: string;
};

export default function SignUp() {
	const navigation = useNavigation();
	const actionData = useActionData<ActionStatus | undefined>();
	const resendFetcher = useFetcher<ActionStatus>();
	const [showOTP, setShowOTP] = useState(false);
	const [email, setEmail] = useState("");

	useEffect(() => {
		if (actionData?.message) {
			if (actionData?.success) {
				toast.success(actionData.message);
				if (actionData.email) {
					setEmail(actionData.email);
				}
				setShowOTP(true);
			}
			if (!actionData?.success) {
				toast.error(actionData?.message);
			}
		}
	}, [actionData]);

	useEffect(() => {
		if (resendFetcher.data?.message) {
			if (resendFetcher.data?.success) {
				toast.success(resendFetcher.data.message);
			} else {
				toast.error(resendFetcher.data.message);
			}
		}
	}, [resendFetcher.data]);

	const handleResendOTP = () => {
		if (!email) {
			toast.error("Email not found. Please try signing up again.");
			return;
		}

		const formData = new FormData();
		formData.append("email", email);
		formData.append("intent", "resend");
		resendFetcher.submit(formData, { method: "POST", action: "/signup" });
	};

	if (showOTP) {
		return (
			<motion.div {...enterLeftAnimation} layout="position">
				<ConfirmOTP
					path="/api/confirm-signup-otp"
					additionalFormData={{ email }}
					onResend={handleResendOTP}
					isLoading={resendFetcher.state !== "idle"}
				/>
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
