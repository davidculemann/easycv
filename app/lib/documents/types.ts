import { z } from "zod";

// Base date validation
const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");

// Experience Schema
const ExperienceSchema = z.object({
	company: z.string().min(1, "Company name is required"),
	role: z.string().min(1, "Role is required"),
	description: z.string(),
	startDate: dateString,
	endDate: dateString,
});

// Education Schema
const EducationSchema = z.object({
	school: z.string().min(1, "School name is required"),
	degree: z.string().min(1, "Degree is required"),
	startDate: dateString,
	endDate: dateString,
});

// Project Schema
const ProjectSchema = z.object({
	name: z.string().min(1, "Project name is required"),
	description: z.string(),
	startDate: dateString,
	endDate: dateString,
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

// Individual type exports if needed
export type Experience = z.infer<typeof ExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Project = z.infer<typeof ProjectSchema>;
