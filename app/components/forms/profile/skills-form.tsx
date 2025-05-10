import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BaseForm } from "../shared/base-form";
import FormTagList from "../shared/form-tag-list";
import { type FormType, type SkillsFormValues, skillsSchema } from "./logic/types";

interface SkillsFormProps {
	defaultValues: SkillsFormValues;
	isSubmitting?: boolean;
	formType: FormType;
	wasCompleted?: boolean;
}

export function SkillsForm({ defaultValues, isSubmitting, formType, wasCompleted }: SkillsFormProps) {
	const form = useForm<SkillsFormValues>({
		resolver: zodResolver(skillsSchema),
		defaultValues: {
			skills: defaultValues.skills?.length ? defaultValues.skills : [],
		},
		mode: "onChange",
	});

	const skills = form.watch("skills");

	return (
		<BaseForm
			form={form}
			isSubmitting={isSubmitting}
			method="post"
			formType={formType}
			wasCompleted={wasCompleted}
			defaultValues={defaultValues}
		>
			<input type="hidden" name="formType" value={formType} />
			<input type="hidden" name="skills" value={JSON.stringify(skills)} />
			<div className="space-y-6">
				<div>
					<h3 className="text-lg font-medium">Skills</h3>
					<p className="text-sm text-muted-foreground">Add your personal or professional skills</p>
				</div>
				<Separator />

				<FormTagList fieldName="skills" label="Skills" maxTags={20} />
			</div>
		</BaseForm>
	);
}
