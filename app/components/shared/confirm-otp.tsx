import { useEffect } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp";
import { Label } from "../ui/label";
import { LoadingButton } from "./loading-button";

type ActionStatus = {
	message: string;
};

export default function ConfirmOTP({
	path,
	additionalFormData = {},
	onResend,
	isLoading,
}: {
	path: string;
	additionalFormData?: Record<string, string>;
	onResend?: () => void;
	isLoading?: boolean;
}) {
	const email = additionalFormData.email || "your email";
	const fetcher = useFetcher<ActionStatus>();

	useEffect(() => {
		// A successful submission redirects, so `fetcher.data` will only be populated on an error.
		if (fetcher.data) {
			toast.error(fetcher.data.message);
		}
	}, [fetcher.data]);

	return (
		<div className="mx-auto grid w-[350px] gap-6">
			<div>
				<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
					Confirm OTP
				</h2>
				<p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
					Enter the code sent to {email}.
				</p>
			</div>
			<fetcher.Form className="space-y-6 flex flex-col items-center" method="POST" action={path}>
				<div>
					<Label htmlFor="otp" className="sr-only">
						OTP
					</Label>
					<InputOTP
						maxLength={6}
						name="otp"
						onComplete={(value) => {
							const formData = new FormData();
							formData.append("otp", value);
							for (const [key, val] of Object.entries(additionalFormData)) {
								formData.append(key, val);
							}
							fetcher.submit(formData, { method: "POST", action: path });
						}}
					>
						<InputOTPGroup>
							<InputOTPSlot index={0} />
							<InputOTPSlot index={1} />
							<InputOTPSlot index={2} />
						</InputOTPGroup>
						<InputOTPSeparator />
						<InputOTPGroup>
							<InputOTPSlot index={3} />
							<InputOTPSlot index={4} />
							<InputOTPSlot index={5} />
						</InputOTPGroup>
					</InputOTP>
				</div>
				{Object.entries(additionalFormData).map(([key, value]) => (
					<input key={key} type="hidden" name={key} value={value} />
				))}
			</fetcher.Form>
			{onResend && (
				<div className="text-center">
					<LoadingButton variant="link" onClick={onResend} className="text-sm" loading={isLoading}>
						Resend OTP
					</LoadingButton>
				</div>
			)}
		</div>
	);
}
