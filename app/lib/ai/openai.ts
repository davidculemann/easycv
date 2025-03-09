import { createOpenAI } from "@ai-sdk/openai";
import { fetch } from "undici";

export const openai = createOpenAI({
	apiKey: process.env.OPENAI_API_KEY,
	fetch: fetch as any,
});
