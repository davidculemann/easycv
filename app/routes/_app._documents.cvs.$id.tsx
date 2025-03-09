import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CVContextSchema } from "@/lib/documents/types";
import { experimental_useObject as useObject } from "@ai-sdk/react";
// import { useParams } from "@remix-run/react";
import { useState } from "react";
import { z } from "zod";

export default function CV() {
	// const params = useParams();
	const [model, setModel] = useState("deepseek");

	const { isLoading, object, submit, ...attributes } = useObject({
		api: "/api/cv/generate",
		schema: z.object({
			cv: CVContextSchema,
		}),
	});

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
				</div>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel>
				<div className="flex h-full p-6 overflow-auto">
					<pre className="whitespace-pre-wrap">{JSON.stringify(object, null, 2)}</pre>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
