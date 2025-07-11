import { ChevronRight, SaveIcon } from "lucide-react";
import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import { type FormMethod, Form as RemixForm, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import type { FormType } from "../profile/logic/types";
import { getNextSectionName, sectionOrder } from "../profile/logic/utils";

export interface BaseFormProps {
	form: UseFormReturn<any>;
	onSubmit?: (data: any) => void;
	method?: FormMethod;
	isSubmitting?: boolean;
	children: React.ReactNode;
	formType: FormType;
	wasCompleted?: boolean;
	defaultValues: any;
	onBack?: () => void;
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
	onBack,
}: BaseFormProps) {
	const [, setSearchParams] = useSearchParams();

	useEffect(() => {
		form.reset(defaultValues, { keepValues: true });
	}, [defaultValues]);

	const canSubmit = form.formState.isValid && (form.formState.isDirty || wasCompleted);
	const shouldSkip = !form.formState.isDirty && wasCompleted;

	const currentIndex = sectionOrder.indexOf(formType);
	const nextSection = currentIndex < sectionOrder.length - 1 ? sectionOrder[currentIndex + 1] : null;
	const isFinalSection = nextSection === null;
	const prevSection = currentIndex > 0 ? sectionOrder[currentIndex - 1] : null;

	function handleNext() {
		if (nextSection) setSearchParams({ section: nextSection });
	}

	function handleBack() {
		if (onBack) return onBack();
		if (prevSection) setSearchParams({ section: prevSection });
	}

	const handleSubmit = async (data: any) => {
		if (onSubmit) {
			onSubmit(data);
		}
		if (nextSection && !shouldSkip) {
			handleNext();
		}
	};

	return (
		<Form {...form}>
			<RemixForm onSubmit={form.handleSubmit(handleSubmit)} method={method} className="space-y-8 flex-1">
				<CardContent>{children}</CardContent>
				<CardFooter>
					<div className="w-full flex justify-between gap-2">
						<div>
							{prevSection && (
								<Button type="button" variant="outline" onClick={handleBack}>
									Back
								</Button>
							)}
						</div>
						<div className="flex gap-2">
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
							{!(isFinalSection && shouldSkip) && (
								<Button
									type={shouldSkip ? "button" : "submit"}
									disabled={!canSubmit || isSubmitting}
									className="group relative"
									{...(shouldSkip && {
										onClick: handleNext,
									})}
								>
									{isFinalSection ? "Finish" : `Next: ${getNextSectionName(nextSection)}`}
									<ChevronRight className="ml-2 h-4 w-4 hover-slide-x" />
								</Button>
							)}
						</div>
					</div>
				</CardFooter>
			</RemixForm>
		</Form>
	);
}
