import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { type FormMethod, Form as RemixForm } from "@remix-run/react";
import type { UseFormReturn } from "react-hook-form";

export interface BaseFormProps {
	form: UseFormReturn<any>;
	onSubmit?: (data: any) => void;
	method?: FormMethod;
	isSubmitting?: boolean;
	children: React.ReactNode;
}

export function BaseForm({ form, onSubmit, method, isSubmitting, children }: BaseFormProps) {
	const canSubmit = form.formState.isValid && form.formState.isDirty;

	return (
		<Form {...form}>
			<RemixForm {...{ onSubmit, method }} className="space-y-8 flex-1">
				<CardContent>{children}</CardContent>
				<CardFooter>
					<Button type="submit" disabled={!canSubmit || isSubmitting} className="w-full">
						{isSubmitting ? "Saving..." : "Save Changes"}
					</Button>
				</CardFooter>
			</RemixForm>
		</Form>
	);
}
