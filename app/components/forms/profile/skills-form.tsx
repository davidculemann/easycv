import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { BaseForm } from "../shared/base-form";
import FormTagList from "../shared/form-tag-list";
import { type FormType, type SkillsFormValues, skillsSchema } from "./logic/types";

interface SkillsFormProps {
	defaultValues: SkillsFormValues;
	formType: FormType;
	onSubmit?: (data: SkillsFormValues) => void;
	wasCompleted?: boolean;
	formProps?: Record<string, any>;
}

export function SkillsForm({ defaultValues, formType, onSubmit, wasCompleted, formProps = {} }: SkillsFormProps) {
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
			method="POST"
			formType={formType}
			wasCompleted={wasCompleted}
			defaultValues={defaultValues}
			onSubmit={onSubmit}
			{...formProps}
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
