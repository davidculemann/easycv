import { createDeepSeek } from "@ai-sdk/deepseek";
import { fetch } from "undici";

export const deepseek = createDeepSeek({
	apiKey: process.env.DEEPSEEK_API_KEY ?? "",
	fetch: fetch as any,
});
