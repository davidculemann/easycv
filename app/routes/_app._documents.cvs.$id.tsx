import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useParams } from "@remix-run/react";

export default function CV() {
	const params = useParams();

	return (
		<ResizablePanelGroup direction="horizontal" className="border h-full">
			<ResizablePanel>
				<div className="flex items-center justify-center p-6">
					<span className="font-semibold">Editor</span>
				</div>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel>
				<ResizablePanel>
					<div className="flex h-full items-center justify-center p-6">
						<span className="font-semibold">Preview</span>
					</div>
				</ResizablePanel>
				<ResizableHandle />
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
