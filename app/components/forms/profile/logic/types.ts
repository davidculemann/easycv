import type { Database } from "db_types";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import type { sections } from "./utils";

export type CVProfileInput = Omit<Database["public"]["Tables"]["cv_profiles"]["Row"], "id" | "user_id">;

export type ParsedCVProfile = {
	id: number;
	first_name: string | null;
	last_name: string | null;
	email: string | null;
	phone: string | null;
	address: string | null;
	linkedin: string | null;
	github: string | null;
	website: string | null;
	created_at: string;
	updated_at: string;

	education: Array<{
		school: string;
		degree: string;
		startDate: string;
		endDate: string;
		location?: string;
		description?: string[] | string;
	}>;
	experience: Array<{
		company: string;
		role: string;
		startDate: string;
		endDate: string;
		location?: string;
		description?: string[] | string;
	}>;
	skills: string[];
	projects: Array<{
		name: string;
		description?: string | string[];
		skills?: string[];
		link?: string;
	}>;
	completion: Record<string, any>;
};

export const profileSchema = z.object({
	first_name: z.string().nullable(),
	last_name: z.string().nullable(),
	email: z.string().nullable(),
	phone: z.string().nullable(),
	address: z.string().nullable(),
	linkedin: z.string().nullable(),
	github: z.string().nullable(),
	website: z.string().nullable(),
	education: z
		.array(
			z.object({
				school: z.string(),
				degree: z.string(),
				startDate: z.string(),
				endDate: z.string(),
				location: z.string().optional(),
				description: z.union([z.array(z.string()), z.string()]).optional(),
			}),
		)
		.default([]),
	experience: z
		.array(
			z.object({
				company: z.string(),
				role: z.string(),
				startDate: z.string(),
				endDate: z.string(),
				location: z.string().optional(),
				description: z.union([z.array(z.string()), z.string()]).optional(),
			}),
		)
		.default([]),
	skills: z.array(z.string()).default([]),
	projects: z
		.array(
			z.object({
				name: z.string(),
				description: z.union([z.string(), z.array(z.string())]).optional(),
				skills: z.array(z.string()).optional(),
				link: z.string().optional(),
			}),
		)
		.default([]),
	completion: z.record(z.any()).default({}),
});

export function ensureValidProfile(profile: any): ParsedCVProfile {
	if (!profile) {
		return {
			id: 0,
			first_name: null,
			last_name: null,
			email: null,
			phone: null,
			address: null,
			linkedin: null,
			github: null,
			website: null,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			education: [],
			experience: [],
			skills: [],
			projects: [],
			completion: {},
		};
	}

	return {
		id: profile.id ?? 0,
		first_name: profile.first_name ?? null,
		last_name: profile.last_name ?? null,
		email: profile.email ?? null,
		phone: profile.phone ?? null,
		address: profile.address ?? null,
		linkedin: profile.linkedin ?? null,
		github: profile.github ?? null,
		website: profile.website ?? null,
		created_at: profile.created_at ?? new Date().toISOString(),
		updated_at: profile.updated_at ?? new Date().toISOString(),
		education: Array.isArray(profile.education) ? profile.education : [],
		experience: Array.isArray(profile.experience) ? profile.experience : [],
		skills: Array.isArray(profile.skills) ? profile.skills : [],
		projects: Array.isArray(profile.projects) ? profile.projects : [],
		completion: profile.completion && typeof profile.completion === "object" ? profile.completion : {},
	};
}

// Personal Info Schema
export const personalInfoSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email address"),
	phone: z
		.string()
		.min(1, "Phone number is required")
		.regex(/^\+?[0-9\s()-]{10,15}$/, "Enter a valid phone number"),
	address: z.string().optional(),
	linkedin: z.string().url("Must be a valid URL").or(z.string().length(0)).optional(),
	github: z.string().url("Must be a valid URL").or(z.string().length(0)).optional(),
	website: z.string().url("Must be a valid URL").or(z.string().length(0)).optional(),
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

export const educationItemSchema = z.object({
	school: z.string().min(1, "School name is required"),
	degree: z.string().min(1, "Degree is required"),
	startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
	endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
	location: z.string().optional(),
	description: z.array(z.string()).optional(),
	current: z.boolean().optional(),
});

export const educationSchema = z.object({
	educations: z.array(educationItemSchema),
});

export type EducationItem = z.infer<typeof educationItemSchema>;
export type EducationFormValues = z.infer<typeof educationSchema>;

// Experience Schema
export const experienceItemSchema = z.object({
	company: z.string().min(1, "Company name is required"),
	role: z.string().min(1, "Role is required"),
	startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
	endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
	location: z.string().optional(),
	description: z.array(z.string()).optional(),
	current: z.boolean().optional(),
});

export const experienceSchema = z.object({
	experiences: z.array(experienceItemSchema),
});

export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type ExperienceFormValues = z.infer<typeof experienceSchema>;

// Skills Schema
export const skillsSchema = z.object({
	skills: z.array(z.string()).min(1, "At least one skill is required"),
});

export type SkillsFormValues = z.infer<typeof skillsSchema>;

// Projects Schema
export const projectsItemSchema = z.object({
	name: z.string().min(1, "Project name is required"),
	description: z.union([z.string(), z.array(z.string())]).optional(),
	skills: z.array(z.string()).optional(),
	link: z.string().url("Must be a valid URL").or(z.string().length(0)).optional(),
});

export const projectsSchema = z.object({
	projects: z.array(projectsItemSchema),
});

export type ProjectsItem = z.infer<typeof projectsItemSchema>;
export type ProjectsFormValues = z.infer<typeof projectsSchema>;

// Form Types
export type FormType = keyof typeof sections;

export interface BaseFormProps {
	form: UseFormReturn<any>;
	onSubmit: (data: any) => void;
	isSubmitting?: boolean;
	children: React.ReactNode;
}
