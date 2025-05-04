import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Form as FormUI } from "@/components/ui/form";
import { Form as RemixForm } from "@remix-run/react";
import { Loader2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

interface BaseFormProps {
	form: UseFormReturn<any>;
	onSubmit: (data: any) => void;
	children: React.ReactNode;
	isSubmitting?: boolean;
	submitText?: string;
}

export function BaseForm({
	form,
	onSubmit,
	children,
	isSubmitting = false,
	submitText = "Save Changes",
}: BaseFormProps) {
	const isValid = form.formState.isValid;
	const isDirty = form.formState.isDirty;
	const canSubmit = isValid && isDirty;

	return (
		<FormUI {...form}>
			<RemixForm method="POST" onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
				<CardContent className="space-y-6">{children}</CardContent>
				<CardFooter className="flex justify-end">
					<Button type="submit" disabled={!canSubmit || isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Saving...
							</>
						) : (
							submitText
						)}
					</Button>
				</CardFooter>
			</RemixForm>
		</FormUI>
	);
}
