import { z } from "zod";

// Base date validation
const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");

// Experience Schema
const ExperienceSchema = z.object({
	company: z.string().min(1, "Company name is required"),
	role: z.string().min(1, "Role is required"),
	description: z.union([z.string(), z.array(z.string())]),
	startDate: dateString,
	endDate: dateString,
	location: z.string().optional(),
});

// Education Schema
const EducationSchema = z.object({
	school: z.string().min(1, "School name is required"),
	degree: z.string().min(1, "Degree is required"),
	startDate: dateString,
	endDate: dateString,
	location: z.string().optional(),
	description: z.union([z.string(), z.array(z.string())]).optional(),
});

// Project Schema
const ProjectSchema = z.object({
	name: z.string().min(1, "Project name is required"),
	description: z.union([z.string(), z.array(z.string())]),
	startDate: dateString.optional(),
	endDate: dateString.optional(),
	link: z.string().optional(),
	skills: z.array(z.string()).optional(),
});

// CV Context Schema
export const CVContextSchema = z.object({
	experience: z.array(ExperienceSchema),
	education: z.array(EducationSchema),
	skills: z.array(z.string()),
	projects: z.array(ProjectSchema),
});

// Type inference
export type CVContext = z.infer<typeof CVContextSchema>;

export const ProfileContextSchema = z.object({
	firstName: z.string().min(1, "First name is required").optional(),
	lastName: z.string().min(1, "Last name is required").optional(),
	email: z.string().email("Invalid email address").optional(),
	phone: z.string().optional(),
	website: z.string().url("Invalid website URL").optional(),
	linkedin: z.string().url("Invalid LinkedIn URL").optional(),
	github: z.string().url("Invalid GitHub URL").optional(),
});

export type ProfileContext = z.infer<typeof ProfileContextSchema>;

//NOTE: currently optional fields
const FullCVContextSchema = CVContextSchema.extend(ProfileContextSchema.shape);

export type FullCVContext = z.infer<typeof FullCVContextSchema>;

// Individual type exports if needed
export type Experience = z.infer<typeof ExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Project = z.infer<typeof ProjectSchema>;
