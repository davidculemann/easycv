import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { type FormMethod, Form as RemixForm } from "@remix-run/react";
import { ChevronRight } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { FormType } from "./types";

export interface BaseFormProps {
	form: UseFormReturn<any>;
	onSubmit?: (data: any) => void;
	method?: FormMethod;
	isSubmitting?: boolean;
	children: React.ReactNode;
	formType: FormType;
}

export function BaseForm({ form, onSubmit, method, isSubmitting, children, formType }: BaseFormProps) {
	const canSubmit = form.formState.isValid && form.formState.isDirty;

	const sectionOrder: FormType[] = ["personal", "education", "experience", "skills", "projects"];
	const currentIndex = sectionOrder.indexOf(formType);
	const nextSection = currentIndex < sectionOrder.length - 1 ? sectionOrder[currentIndex + 1] : null;

	const getNextSectionName = (section: FormType | null): string => {
		if (!section) return "";
		const names: Record<FormType, string> = {
			personal: "Education",
			education: "Experience",
			experience: "Skills",
			skills: "Projects",
			projects: "Complete",
		};
		return names[section];
	};

	return (
		<Form {...form}>
			<RemixForm {...{ onSubmit, method }} className="space-y-8 flex-1">
				<CardContent>{children}</CardContent>
				<CardFooter>
					<div className="w-full flex justify-end">
						<Button type="submit" disabled={!canSubmit || isSubmitting} className="group relative">
							Next: {getNextSectionName(nextSection)}
							<ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
						</Button>
					</div>
				</CardFooter>
			</RemixForm>
		</Form>
	);
}
