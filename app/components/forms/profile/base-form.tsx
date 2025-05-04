import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";

export interface BaseFormProps {
	form: UseFormReturn<any>;
	onSubmit: (data: any) => void;
	isSubmitting?: boolean;
	children: React.ReactNode;
}

export function BaseForm({ form, onSubmit, isSubmitting, children }: BaseFormProps) {
	const canSubmit = form.formState.isValid && form.formState.isDirty;

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex-1">
				<CardContent>{children}</CardContent>
				<CardFooter>
					<Button type="submit" disabled={!canSubmit || isSubmitting} className="w-full">
						{isSubmitting ? "Saving..." : "Save Changes"}
					</Button>
				</CardFooter>
			</form>
		</Form>
	);
}
