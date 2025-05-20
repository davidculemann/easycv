import { Briefcase, GraduationCap, Pen } from "lucide-react";

export const AI_PROVIDERS = {
	deepseek: {
		id: "deepseek",
		displayName: "DeepSeek",
		proOnly: false,
		modelIds: ["deepseek-chat"],
		defaultModelId: "deepseek-chat",
	},
	openai: {
		id: "openai",
		displayName: "OpenAI",
		proOnly: true,
		modelIds: ["gpt-4o", "gpt-4o-mini"],
		defaultModelId: "gpt-4o",
	},
};

export const RECOMMENDED_MODEL = AI_PROVIDERS.deepseek.defaultModelId;

export type AIProvider = keyof typeof AI_PROVIDERS;

export const TONES = [
	{
		value: "professional",
		label: "Professional",
		description: "Formal language suitable for corporate environments",
		icon: Briefcase,
		example: "Experienced software engineer with expertise in React and TypeScript...",
	},
	{
		value: "academic",
		label: "Academic",
		description: "Scholarly tone ideal for research and education",
		icon: GraduationCap,
		example: "Research-focused software engineer specializing in the implementation of React frameworks...",
	},
	{
		value: "creative",
		label: "Creative",
		description: "Engaging style that showcases personality",
		icon: Pen,
		example: "Passionate coder who loves bringing ideas to life through React and TypeScript...",
	},
] as const;

export const RECOMMENDED_TONE = "professional";
