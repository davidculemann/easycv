import type { Database } from "db_types";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import type { sections } from "./utils";

export type CVProfileInput = Omit<Database["public"]["Tables"]["cv_profiles"]["Row"], "id" | "user_id">;

export type ParsedCVProfile = Omit<Database["public"]["Tables"]["cv_profiles"]["Row"], "user_id"> & {
	education: any[];
	experience: any[];
	skills: string[];
	projects: any[];
	completion: Record<string, any>;
};

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
	description: z.string().optional(),
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
