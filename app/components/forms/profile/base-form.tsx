import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { type FormMethod, Form as RemixForm, useSearchParams } from "@remix-run/react";
import { ChevronRight, SaveIcon } from "lucide-react";
import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { FormType } from "./types";

export interface BaseFormProps {
	form: UseFormReturn<any>;
	onSubmit?: (data: any) => void;
	method?: FormMethod;
	isSubmitting?: boolean;
	children: React.ReactNode;
	formType: FormType;
	wasCompleted?: boolean;
	defaultValues: any;
}

export function BaseForm({
	form,
	onSubmit,
	method,
	isSubmitting,
	children,
	formType,
	wasCompleted = false,
	defaultValues,
}: BaseFormProps) {
	const [, setSearchParams] = useSearchParams();

	useEffect(() => {
		form.reset(defaultValues, { keepValues: true });
	}, [defaultValues]);

	const canSubmit = form.formState.isValid && (form.formState.isDirty || wasCompleted);
	const shouldSkip = !form.formState.isDirty && wasCompleted;

	const sectionOrder: FormType[] = ["personal", "education", "experience", "skills", "projects"];
	const currentIndex = sectionOrder.indexOf(formType);
	const nextSection = currentIndex < sectionOrder.length - 1 ? sectionOrder[currentIndex + 1] : null;

	function getNextSectionName(section: FormType | null): string {
		if (!section) return "";
		const names: Record<FormType, string> = {
			personal: "Personal",
			education: "Education",
			experience: "Experience",
			skills: "Skills",
			projects: "Complete",
		};
		return names[section];
	}

	function handleNext() {
		if (nextSection) setSearchParams({ section: nextSection });
	}

	return (
		<Form {...form}>
			<RemixForm {...{ onSubmit, method }} className="space-y-8 flex-1">
				<CardContent>{children}</CardContent>
				<CardFooter>
					<div className="w-full flex justify-end gap-2">
						{wasCompleted && (
							<Button
								type="submit"
								disabled={!form.formState.isDirty}
								variant="secondary"
								value="saveChanges"
								name="saveChanges"
							>
								Save Changes
								<SaveIcon />
							</Button>
						)}
						<Button
							type={shouldSkip ? "button" : "submit"}
							disabled={!canSubmit || isSubmitting}
							className="group relative"
							{...(shouldSkip && {
								onClick: handleNext,
							})}
						>
							Next: {getNextSectionName(nextSection)}
							<ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
						</Button>
					</div>
				</CardFooter>
			</RemixForm>
		</Form>
	);
}
