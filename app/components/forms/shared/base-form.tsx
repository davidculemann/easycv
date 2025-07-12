import { ChevronRight, SaveIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { type FormMethod, Form as ReactRouterForm, useSearchParams, useSubmit } from "react-router";
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
	onNext?: () => void;
	allowSkipWhenNotDirty?: boolean;
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
	onNext,
	allowSkipWhenNotDirty = false,
}: BaseFormProps) {
	const [, setSearchParams] = useSearchParams();
	const submit = useSubmit();
	const formRef = useRef<HTMLFormElement>(null);
	const [saveChanges, setSaveChanges] = useState<string | undefined>();

	useEffect(() => {
		form.reset(defaultValues, { keepDirtyValues: true });
	}, [defaultValues, form]);

	const canSubmit = form.formState.isValid && (form.formState.isDirty || wasCompleted);
	const shouldSkip = !form.formState.isDirty && (wasCompleted || allowSkipWhenNotDirty);

	const currentIndex = sectionOrder.indexOf(formType);
	const nextSection = currentIndex < sectionOrder.length - 1 ? sectionOrder[currentIndex + 1] : null;
	const isFinalSection = nextSection === null;
	const prevSection = currentIndex > 0 ? sectionOrder[currentIndex - 1] : null;

	function handleNext() {
		if (onNext) {
			onNext();
		} else if (nextSection) {
			setSearchParams({ section: nextSection });
		}
	}

	function handleBack() {
		if (onBack) return onBack();
		if (prevSection) setSearchParams({ section: prevSection });
	}

	const handleSubmit = (data: any) => {
		if (onSubmit) {
			onSubmit(data);
		} else if (formRef.current) {
			submit(formRef.current);
		}
	};

	const handleSaveChanges = () => {
		setSaveChanges("true");
	};

	return (
		<Form {...form}>
			<ReactRouterForm
				ref={formRef}
				onSubmit={form.handleSubmit(handleSubmit)}
				method={method}
				className="space-y-8 flex-1"
			>
				{saveChanges && <input type="hidden" name="saveChanges" value={saveChanges} />}
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
									onClick={handleSaveChanges}
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
									onClick={shouldSkip ? handleNext : undefined}
								>
									{isFinalSection ? "Finish" : `Next: ${getNextSectionName(nextSection)}`}
									<ChevronRight className="ml-2 h-4 w-4 hover-slide-x" />
								</Button>
							)}
						</div>
					</div>
				</CardFooter>
			</ReactRouterForm>
		</Form>
	);
}
