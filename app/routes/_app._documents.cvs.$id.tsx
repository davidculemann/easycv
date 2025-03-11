import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCV } from "@/hooks/api-hooks/useCV";
import { type CVContext, CVContextSchema } from "@/lib/documents/types";
import type { SupabaseOutletContext } from "@/lib/supabase/supabase";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { useOutletContext, useParams } from "@remix-run/react";
import { useState } from "react";
import { z } from "zod";

export default function CV() {
	const params = useParams();
	const { id } = params;
	const { supabase } = useOutletContext<SupabaseOutletContext>();
	const [model, setModel] = useState("deepseek");

	const { isLoading, object, submit, ...attributes } = useObject({
		api: "/api/cv/generate",
		schema: z.object({
			cv: CVContextSchema,
		}),
	});

	const { updateCV, isUpdatingCV, cv } = useCV({ supabase, id: id ?? "" });

	function handleSaveChanges() {
		if (!object) return;
		updateCV({ id: id ?? "", cv: object.cv as CVContext });
	}

	const dataToDisplay = object?.cv ?? cv?.cv;

	return (
		<ResizablePanelGroup direction="horizontal" className="border h-full">
			<ResizablePanel>
				<div className="flex flex-col gap-4 p-6">
					<Select value={model} onValueChange={setModel}>
						<SelectTrigger>
							<SelectValue placeholder="Select a model" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="openai">OpenAI</SelectItem>
							<SelectItem value="deepseek">DeepSeek</SelectItem>
						</SelectContent>
					</Select>
					<Button
						onClick={() => submit({ context: "Nothing for now just make it up", model: "deepseek" })}
						disabled={isLoading}
					>
						{isLoading ? "Generating..." : "Generate CV"}
					</Button>
					<Button
						variant="outline"
						disabled={isLoading || !object || isUpdatingCV}
						onClick={handleSaveChanges}
					>
						Save Changes
					</Button>
				</div>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel style={{ viewTransitionName: `cv-card-${id}`, contain: "layout" }}>
				<div className="flex h-full p-6 overflow-auto">
					<pre className="whitespace-pre-wrap">{JSON.stringify(dataToDisplay, null, 2)}</pre>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
