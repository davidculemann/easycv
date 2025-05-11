import type {
	EducationFormValues,
	ExperienceFormValues,
	FormType,
	ParsedCVProfile,
	ProjectsFormValues,
	SkillsFormValues,
} from "./types";
import { ensureValidProfile } from "./types";

export const sections = {
	personal: "personal",
	education: "education",
	experience: "experience",
	projects: "projects",
	skills: "skills",
} as const;

export const sectionNames = {
	personal: "Personal",
	education: "Education",
	experience: "Experience",
	projects: "Projects",
	skills: "Skills",
} as const;

export const sectionOrder = Object.values(sections);

export function getNextSectionName(section: FormType | null): string {
	if (!section) return "";

	return sectionNames[section];
}

export const getEducationFormData = (profile: ParsedCVProfile | null | undefined): EducationFormValues => {
	const validProfile = profile ? ensureValidProfile(profile) : ensureValidProfile(null);

	// If no education entries exist, return default
	if (validProfile.education.length === 0) {
		return {
			educations: [{ school: "", degree: "", startDate: "", endDate: "", location: "", description: [""] }],
		};
	}

	return {
		educations: validProfile.education.map((edu) => ({
			school: edu.school || "",
			degree: edu.degree || "",
			startDate: edu.startDate || "",
			endDate: edu.endDate || "",
			location: edu.location || "",
			description: Array.isArray(edu.description)
				? edu.description
				: typeof edu.description === "string"
					? [edu.description]
					: [""],
		})),
	};
};

export const getExperienceFormData = (profile: ParsedCVProfile | null | undefined): ExperienceFormValues => {
	const validProfile = profile ? ensureValidProfile(profile) : ensureValidProfile(null);

	if (validProfile.experience.length === 0) {
		return {
			experiences: [{ company: "", role: "", startDate: "", endDate: "", location: "", description: [""] }],
		};
	}

	return {
		experiences: validProfile.experience.map((exp) => ({
			company: exp.company || "",
			role: exp.role || "",
			startDate: exp.startDate || "",
			endDate: exp.endDate || "",
			location: exp.location || "",
			description: Array.isArray(exp.description)
				? exp.description
				: typeof exp.description === "string"
					? [exp.description]
					: [""],
		})),
	};
};

export const getProjectsFormData = (profile: ParsedCVProfile | null | undefined): ProjectsFormValues => {
	const validProfile = profile ? ensureValidProfile(profile) : ensureValidProfile(null);

	if (validProfile.projects.length === 0) {
		return {
			projects: [{ name: "", description: "", skills: [], link: "" }],
		};
	}

	return {
		projects: validProfile.projects.map((project) => ({
			name: project.name || "",
			description: project.description || "",
			skills: Array.isArray(project.skills) ? project.skills : [],
			link: project.link || "",
		})),
	};
};

export const getSkillsFormData = (profile: ParsedCVProfile | null | undefined): SkillsFormValues => {
	const validProfile = profile ? ensureValidProfile(profile) : ensureValidProfile(null);

	if (validProfile.skills.length === 0) {
		return { skills: [""] };
	}

	return { skills: validProfile.skills };
};

export function checkSectionCompletion(profile: ParsedCVProfile | null | undefined, section: FormType): boolean {
	const validProfile = profile ? ensureValidProfile(profile) : ensureValidProfile(null);

	switch (section) {
		case "personal":
			return Boolean(
				validProfile.first_name && validProfile.last_name && validProfile.email && validProfile.phone,
			);
		case "education":
			return (
				Array.isArray(validProfile.education) &&
				validProfile.education.length > 0 &&
				Boolean(
					validProfile.education[0].school &&
						validProfile.education[0].degree &&
						validProfile.education[0].startDate &&
						validProfile.education[0].endDate,
				)
			);
		case "experience":
			return (
				Array.isArray(validProfile.experience) &&
				validProfile.experience.length > 0 &&
				Boolean(
					validProfile.experience[0].company &&
						validProfile.experience[0].role &&
						validProfile.experience[0].startDate &&
						validProfile.experience[0].endDate,
				)
			);
		case "projects":
			return (
				Array.isArray(validProfile.projects) &&
				validProfile.projects.length > 0 &&
				Boolean(validProfile.projects[0].name)
			);
		case "skills":
			return (
				Array.isArray(validProfile.skills) && validProfile.skills.length > 0 && Boolean(validProfile.skills[0])
			);
		default:
			return false;
	}
}

export function getSectionStats(profile: ParsedCVProfile | null | undefined) {
	const validProfile = profile ? ensureValidProfile(profile) : ensureValidProfile(null);

	return {
		personal: checkSectionCompletion(validProfile, "personal") ? "Completed" : "Not Started",
		education:
			Array.isArray(validProfile.education) && validProfile.education.length > 0
				? `${validProfile.education.length} Item${validProfile.education.length > 1 ? "s" : ""}`
				: "Not Started",
		experience:
			Array.isArray(validProfile.experience) && validProfile.experience.length > 0
				? `${validProfile.experience.length} Item${validProfile.experience.length > 1 ? "s" : ""}`
				: "Not Started",
		projects:
			Array.isArray(validProfile.projects) && validProfile.projects.length > 0
				? `${validProfile.projects.length} Item${validProfile.projects.length > 1 ? "s" : ""}`
				: "Not Started",
		skills:
			Array.isArray(validProfile.skills) && validProfile.skills.length > 0
				? `${validProfile.skills.length} Skill${validProfile.skills.length > 1 ? "s" : ""}`
				: "Not Started",
	};
}
