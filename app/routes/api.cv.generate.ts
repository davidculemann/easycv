import type { ActionFunctionArgs } from "react-router";
import { streamObject } from "ai";
import { z } from "zod";
import { AI_PROVIDERS } from "@/lib/ai/config";
import { deepseek } from "@/lib/ai/deepseek";
import { openai } from "@/lib/ai/openai";
import { CVContextSchema } from "@/lib/documents/types";
import { getSupabaseWithHeaders, requireUser } from "@/lib/supabase/supabase.server";
import { isProPlan } from "@/services/stripe/plans";

export const maxDuration = 60;

export async function action({ request }: ActionFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const user = await requireUser({ supabase, headers: request.headers });
	const { data: subscription } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).single();

	const { context, model = "deepseek" } = await request.json();

	const selectedModelProvider = AI_PROVIDERS[model as keyof typeof AI_PROVIDERS];
	const isPro = isProPlan(subscription?.plan_id);

	const modelMap = {
		openai,
		deepseek,
	};

	if (!isPro && selectedModelProvider.proOnly) {
		return new Response("You are not authorized to use this model", { status: 403 });
	}

	const selectedModel = isPro
		? modelMap[selectedModelProvider.id as keyof typeof modelMap](selectedModelProvider.defaultModelId)
		: deepseek(selectedModelProvider.defaultModelId);

	const stringifiedContext = JSON.stringify(context ?? {});

	const result = streamObject({
		model: selectedModel,
		schema: z.object({
			cv: CVContextSchema,
		}),
		prompt: `Generate a CV with the following context: ${stringifiedContext}`,
	});

	return result.toTextStreamResponse();
}
