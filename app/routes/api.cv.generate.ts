import { openai } from "@/lib/ai/openai";
import { CVContextSchema } from "@/lib/documents/types";
import type { ActionFunctionArgs } from "@remix-run/node";
import { streamObject } from "ai";
import { z } from "zod";

export const maxDuration = 60;

export async function action({ request }: ActionFunctionArgs) {
	const context = await request.json();

	console.log(context, "context");

	const result = streamObject({
		model: openai("gpt-4o"),
		schema: z.object({
			cv: CVContextSchema,
		}),
		prompt: `Generate a CV with the following context: ${context.context ?? "Nothing for now just make it up"}`,
		onError({ error }) {
			console.error(error); // your error logging logic here
		},
	});

	console.log(result, "result");

	return result.toTextStreamResponse();
}
