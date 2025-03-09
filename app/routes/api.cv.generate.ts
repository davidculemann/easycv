import { deepseek } from "@/lib/ai/deepseek";
import { openai } from "@/lib/ai/openai";
import { CVContextSchema } from "@/lib/documents/types";
import type { ActionFunctionArgs } from "@remix-run/node";
import { streamObject } from "ai";
import { z } from "zod";

export const maxDuration = 60;

export async function action({ request }: ActionFunctionArgs) {
	const { context, model = "deepseek" } = await request.json();

	const modelMap = {
		openai: openai("gpt-4o"),
		deepseek: deepseek("deepseek-chat"),
	};

	const result = streamObject({
		model: modelMap[model as keyof typeof modelMap],
		schema: z.object({
			cv: CVContextSchema,
		}),
		prompt: `Generate a CV with the following context: ${context.context ?? "Nothing for now just make it up"}`,
		onError({ error }) {
			console.error(error); // your error logging logic here
		},
	});

	return result.toTextStreamResponse();
}
