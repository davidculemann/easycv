import { deepseek } from "@/lib/ai/deepseek";
import { openai } from "@/lib/ai/openai";
import { CVContextSchema } from "@/lib/documents/types";
import { getSupabaseWithHeaders, requireUser } from "@/lib/supabase/supabase.server";
import { isProPlan } from "@/services/stripe/plans";
import type { ActionFunctionArgs } from "@remix-run/node";
import { streamObject } from "ai";
import { z } from "zod";

export const maxDuration = 60;

export async function action({ request }: ActionFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const user = await requireUser({ supabase, headers: request.headers });
	const { data: subscription } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).single();

	const { context, model = "deepseek" } = await request.json();

	const modelMap = {
		openai: {
			model: openai("gpt-4o"),
			proOnly: false,
		},
		deepseek: {
			model: deepseek("deepseek-chat"),
			proOnly: true,
		},
	};

	const selectedModelProvider = modelMap[model as keyof typeof modelMap];
	const isPro = isProPlan(subscription?.plan_id);

	if (!isPro && selectedModelProvider.proOnly) {
		return new Response("You are not authorized to use this model", { status: 403 });
	}

	const selectedModel = isPro ? selectedModelProvider.model : modelMap.deepseek.model;

	const result = streamObject({
		model: selectedModel,
		schema: z.object({
			cv: CVContextSchema,
		}),
		prompt: `Generate a CV with the following context: ${context.context ?? "Nothing for now just make it up"}`,
	});

	return result.toTextStreamResponse();
}
