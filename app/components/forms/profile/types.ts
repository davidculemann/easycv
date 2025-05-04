import { validatePhone } from "@/lib/utils";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";

// Personal Info Schema
export const personalInfoSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email address"),
	phone: z.string().refine(validatePhone, "Invalid phone number"),
	address: z.string().optional(),
	linkedin: z.string().url("Must be a valid URL").or(z.string().length(0)).optional(),
	github: z.string().url("Must be a valid URL").or(z.string().length(0)).optional(),
	website: z.string().url("Must be a valid URL").or(z.string().length(0)).optional(),
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

// Education Schema
export const educationSchema = z.object({
	school: z.string().min(1, "School name is required"),
	degree: z.string().min(1, "Degree is required"),
	startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
	endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
	location: z.string().optional(),
	description: z.string().optional(),
});

export type EducationFormValues = z.infer<typeof educationSchema>;

// Experience Schema
export const experienceSchema = z.object({
	company: z.string().min(1, "Company name is required"),
	role: z.string().min(1, "Role is required"),
	description: z.string(),
	startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
	endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
	location: z.string().optional(),
});

export type ExperienceFormValues = z.infer<typeof experienceSchema>;

// Skills Schema
export const skillsSchema = z.object({
	skills: z.array(z.string()).min(1, "At least one skill is required"),
});

export type SkillsFormValues = z.infer<typeof skillsSchema>;

// Projects Schema
export const projectsSchema = z.object({
	name: z.string().min(1, "Project name is required"),
	description: z.string(),
	startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
	endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

export type ProjectsFormValues = z.infer<typeof projectsSchema>;

// Form Types
export type FormType = "profile" | "education" | "experience" | "skills" | "projects";

export interface BaseFormProps {
	form: UseFormReturn<any>;
	onSubmit: (data: any) => void;
	isSubmitting?: boolean;
	children: React.ReactNode;
}
