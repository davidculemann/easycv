import type {
	EducationFormValues,
	EducationItem,
	ExperienceFormValues,
	ExperienceItem,
	ParsedCVProfile,
	ProjectsFormValues,
	ProjectsItem,
} from "./types";

export const getEducationFormData = (profile: ParsedCVProfile): EducationFormValues => {
	if (!profile || !profile.education) {
		return {
			educations: [{ school: "", degree: "", startDate: "", endDate: "", location: "", description: [""] }],
		};
	}
	return {
		educations: profile.education.map((edu: EducationItem) => ({
			school: edu.school || "",
			degree: edu.degree || "",
			startDate: edu.startDate || "",
			endDate: edu.endDate || "",
			location: edu.location || "",
			description: Array.isArray(edu.description) ? edu.description : [edu.description || ""],
		})),
	};
};

export const getExperienceFormData = (profile: ParsedCVProfile): ExperienceFormValues => {
	if (!profile || !profile.experience) {
		return {
			experiences: [{ company: "", role: "", startDate: "", endDate: "", location: "", description: [""] }],
		};
	}
	return {
		experiences: profile.experience.map((exp: ExperienceItem) => ({
			company: exp.company || "",
			role: exp.role || "",
			startDate: exp.startDate || "",
			endDate: exp.endDate || "",
			location: exp.location || "",
			description: Array.isArray(exp.description) ? exp.description : [exp.description || ""],
		})),
	};
};

export const getProjectsFormData = (profile: ParsedCVProfile): ProjectsFormValues => {
	if (!profile || !profile.projects) {
		return {
			projects: [{ name: "", description: "", skills: [], link: "" }],
		};
	}
	return {
		projects: profile.projects.map((project: ProjectsItem) => ({
			name: project.name || "",
			description: project.description || "",
			skills: project.skills || [],
			link: project.link || "",
		})),
	};
};
