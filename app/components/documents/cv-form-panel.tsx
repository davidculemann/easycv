import { EducationForm } from "@/components/forms/profile/education-form";
import { ExperienceForm } from "@/components/forms/profile/experience-form";
import type { ParsedCVProfile, PersonalInfoFormValues } from "@/components/forms/profile/logic/types";
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
	id: string;
	cv: ParsedCVProfile | null | undefined;
	updateCV: (...args: any[]) => void;
	isUpdatingCV: boolean;
	activeTab: string;
	setActiveTab: (tab: string) => void;
}

export function CVFormPanel({ id, cv, updateCV, isUpdatingCV, activeTab, setActiveTab }: CVFormPanelProps) {
	const handlePersonalInfoSubmit = (data: PersonalInfoFormValues) => {
		updateCV({
			cv: {
				first_name: data.firstName,
				last_name: data.lastName,
				email: data.email,
				phone: data.phone,
				address: data.address,
				linkedin: data.linkedin,
				github: data.github,
				website: data.website,
			},
			id,
			onSuccess: () => {
				handleNext();
			},
		});
	};

	const handleExperienceSubmit = (data: any) => {
		updateCV({
			cv: {
				experience: data.experiences,
			},
			id,
			onSuccess: () => {
				handleNext();
			},
		});
	};

	const handleEducationSubmit = (data: any) => {
		updateCV({
			cv: {
				education: data.educations,
			},
			id,
			onSuccess: () => {
				handleNext();
			},
		});
	};

	const handleProjectsSubmit = (data: any) => {
		updateCV({
			cv: {
				projects: data.projects,
			},
			id,
			onSuccess: () => {
				handleNext();
			},
		});
	};

	const handleSkillsSubmit = (data: any) => {
		updateCV({
			cv: {
				skills: data.skills,
			},
			id,
			onSuccess: () => {
				handleNext();
			},
		});
	};

	const personalInfoDefaultValues = {
		firstName: cv?.first_name || "",
		lastName: cv?.last_name || "",
		email: cv?.email || "",
		phone: cv?.phone || "",
		address: cv?.address || "",
		linkedin: cv?.linkedin || "",
		github: cv?.github || "",
		website: cv?.website || "",
	};

	const handleNext = () => {
		const currentIndex = sectionOrder.indexOf(activeTab as any);
		const nextSection = currentIndex < sectionOrder.length - 1 ? sectionOrder[currentIndex + 1] : null;
		if (nextSection) {
			setActiveTab(nextSection);
		}
	};

	const handleBack = () => {
		const currentIndex = sectionOrder.indexOf(activeTab as any);
		const prevSection = currentIndex > 0 ? sectionOrder[currentIndex - 1] : null;
		if (prevSection) {
			setActiveTab(prevSection);
		}
	};

	const formProps = {
		isSubmitting: isUpdatingCV,
		onNext: handleNext,
		onBack: handleBack,
		allowSkipWhenNotDirty: true,
	};

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
						defaultValues={personalInfoDefaultValues}
						formType="personal"
						onSubmit={handlePersonalInfoSubmit}
						formProps={formProps}
					/>
				</TabsContent>
				<TabsContent value="experience" className="mt-0">
					<ExperienceForm
						defaultValues={getExperienceFormData(cv)}
						formType="experience"
						onSubmit={handleExperienceSubmit}
						formProps={formProps}
					/>
				</TabsContent>
				<TabsContent value="education" className="mt-0">
					<EducationForm
						defaultValues={getEducationFormData(cv)}
						formType="education"
						onSubmit={handleEducationSubmit}
						formProps={formProps}
					/>
				</TabsContent>
				<TabsContent value="projects" className="mt-0">
					<ProjectsForm
						defaultValues={getProjectsFormData(cv)}
						formType="projects"
						onSubmit={handleProjectsSubmit}
						formProps={formProps}
					/>
				</TabsContent>
				<TabsContent value="skills" className="mt-0">
					<SkillsForm
						defaultValues={getSkillsFormData(cv)}
						formType="skills"
						onSubmit={handleSkillsSubmit}
						formProps={formProps}
					/>
				</TabsContent>
			</div>
		</Tabs>
	);
}

export default CVFormPanel;
