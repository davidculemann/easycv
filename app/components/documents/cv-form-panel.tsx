import { EducationForm } from "@/components/forms/profile/education-form";
import { ExperienceForm } from "@/components/forms/profile/experience-form";
import type { ParsedCVProfile } from "@/components/forms/profile/logic/types";
import {
	getEducationFormData,
	getExperienceFormData,
	getProjectsFormData,
	getSkillsFormData,
	sectionNames,
	sectionOrder,
} from "@/components/forms/profile/logic/utils";
import { PersonalInfoForm } from "@/components/forms/profile/personal-info-form";
import { ProjectsForm } from "@/components/forms/profile/projects-form";
import { SkillsForm } from "@/components/forms/profile/skills-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CVFormPanelProps {
	cv: ParsedCVProfile | null | undefined;
	updateCV: (...args: any[]) => void;
	isUpdatingCV: boolean;
	activeTab: string;
	setActiveTab: (tab: string) => void;
}

export function CVFormPanel({ cv, updateCV, isUpdatingCV, activeTab, setActiveTab }: CVFormPanelProps) {
	return (
		<Tabs
			value={activeTab}
			onValueChange={(v) => setActiveTab(v)}
			className="flex-1 min-h-0 flex flex-col w-full max-w-full"
		>
			<div className="border-b bg-background p-2 w-full mx-auto @container">
				<div className="hidden @[530px]:block">
					<TabsList className="flex w-full max-w-full">
						{sectionOrder.map((section) => (
							<TabsTrigger key={section} value={section} className="min-w-[90px] flex-1">
								{sectionNames[section]}
							</TabsTrigger>
						))}
					</TabsList>
				</div>
				<div className="block @[530px]:hidden">
					<Select value={activeTab} onValueChange={setActiveTab}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Section" />
						</SelectTrigger>
						<SelectContent>
							{sectionOrder.map((section) => (
								<SelectItem key={section} value={section}>
									{sectionNames[section]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className="flex-1 min-h-0 overflow-y-auto p-4 w-full max-w-full">
				<TabsContent value="personal" className="mt-0">
					<PersonalInfoForm
						defaultValues={{
							firstName: cv?.first_name || "",
							lastName: cv?.last_name || "",
							email: cv?.email || "",
							phone: cv?.phone || "",
							address: cv?.address || "",
							linkedin: cv?.linkedin || "",
							github: cv?.github || "",
							website: cv?.website || "",
						}}
						formType="personal"
					/>
				</TabsContent>
				<TabsContent value="experience" className="mt-0">
					<ExperienceForm defaultValues={getExperienceFormData(cv)} formType="experience" />
				</TabsContent>
				<TabsContent value="education" className="mt-0">
					<EducationForm defaultValues={getEducationFormData(cv)} formType="education" />
				</TabsContent>
				<TabsContent value="projects" className="mt-0">
					<ProjectsForm defaultValues={getProjectsFormData(cv)} formType="projects" />
				</TabsContent>
				<TabsContent value="skills" className="mt-0">
					<SkillsForm defaultValues={getSkillsFormData(cv)} formType="skills" />
				</TabsContent>
			</div>
		</Tabs>
	);
}

export default CVFormPanel;
