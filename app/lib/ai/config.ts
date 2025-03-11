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
