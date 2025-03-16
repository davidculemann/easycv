import ProviderSelector from "@/components/shared/provider-selector";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useCV } from "@/hooks/api-hooks/useCV";
import { type CVContext, CVContextSchema } from "@/lib/documents/types";
import { getUserProfile } from "@/lib/supabase/documents/profile";
import type { SupabaseOutletContext } from "@/lib/supabase/supabase";
import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import { isProPlan } from "@/services/stripe/plans";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useOutletContext, useParams } from "@remix-run/react";
import { IconPdf } from "@tabler/icons-react";
import { Download, FileJson } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";
import { z } from "zod";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });

	const profile = await getUserProfile({ supabase });
	return { profile };
}

//TODO: Use profile to prefill the form

export default function CV() {
	const { profile } = useLoaderData<typeof loader>();
	const params = useParams();
	const { id } = params;
	const { supabase, subscription } = useOutletContext<SupabaseOutletContext>();
	const isPro = isProPlan(subscription?.plan_id);
	const isMobile = useMediaQuery("(max-width: 768px)");
	const [model, setModel] = useState("deepseek");
	const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
	const [pdfData, setPdfData] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<"json" | "pdf">("json");

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

	// Reset PDF view when changing CVs
	useEffect(() => {
		setPdfData(null);
		setViewMode("json");
	}, [id]);

	// Function to generate and display PDF
	const generatePDF = async (download = false) => {
		if (!dataToDisplay) return;

		try {
			setIsGeneratingPdf(true);
			const formData = new FormData();
			formData.append("cvId", id || "");
			formData.append("cvData", JSON.stringify(dataToDisplay));
			formData.append("profile", JSON.stringify(profile));

			// Submit to the resource route and get the response
			const response = await fetch("/api/cv/pdf-latex", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				// Handle error response
				const errorBuffer = await response.arrayBuffer();
				const errorText = new TextDecoder().decode(errorBuffer);
				console.error("Error response:", errorText);

				let errorMessage = "Failed to generate PDF";
				try {
					const errorData = JSON.parse(errorText);
					errorMessage = errorData.error || errorMessage;
				} catch (e) {
					errorMessage = errorText || errorMessage;
				}

				throw new Error(errorMessage);
			}

			// Create a blob from the PDF Stream
			const blob = await response.blob();

			if (download) {
				// Download the PDF
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = `cv-${id}.pdf`;
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
				a.remove();
				toast.success("PDF downloaded successfully");
			} else {
				// Simply set the URL for the iframe
				const url = window.URL.createObjectURL(blob);
				setPdfData(url);
				setViewMode("pdf");
				toast.success("PDF generated successfully");
			}
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to generate PDF");
			console.error(error);
		} finally {
			setIsGeneratingPdf(false);
		}
	};

	function handleGenerateCV() {
		submit({
			context: {
				profile,
			},
			model,
		});
	}

	return (
		<ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"} className="border h-full">
			<ResizablePanel defaultSize={isMobile ? undefined : 30}>
				<div className="flex flex-col gap-4 p-6">
					<ProviderSelector model={model} setModel={setModel} isPro={isPro} />
					<Button onClick={handleGenerateCV} disabled={isLoading}>
						{isLoading ? "Generating..." : "Generate CV"}
					</Button>
					<Button
						variant="outline"
						disabled={isLoading || !object || isUpdatingCV}
						onClick={handleSaveChanges}
					>
						Save Changes
					</Button>

					{/* PDF Generation Buttons */}
					<div className="flex flex-col gap-2">
						<Button
							variant="outline"
							disabled={!dataToDisplay || isGeneratingPdf}
							onClick={() => generatePDF(false)}
							className="flex gap-2"
						>
							<IconPdf className="h-4 w-4" />
							{isGeneratingPdf ? "Generating PDF..." : "Generate & View PDF"}
						</Button>

						<Button
							variant="outline"
							disabled={!dataToDisplay || isGeneratingPdf}
							onClick={() => generatePDF(true)}
							className="flex gap-2"
						>
							<Download className="h-4 w-4" />
							{isGeneratingPdf ? "Generating PDF..." : "Download PDF"}
						</Button>
					</div>

					{/* View Toggle Buttons */}
					{pdfData && (
						<div className="flex gap-2 mt-2">
							<Button
								size="sm"
								variant={viewMode === "json" ? "default" : "outline"}
								onClick={() => setViewMode("json")}
								className="flex gap-2"
							>
								<FileJson className="h-4 w-4" />
								JSON View
							</Button>
							<Button
								size="sm"
								variant={viewMode === "pdf" ? "default" : "outline"}
								onClick={() => setViewMode("pdf")}
								className="flex gap-2"
							>
								<IconPdf className="h-4 w-4" />
								PDF View
							</Button>
						</div>
					)}
				</div>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel style={{ viewTransitionName: `cv-card-${id}`, contain: "layout" }}>
				<div className="flex h-full overflow-auto">
					{viewMode === "json" ? (
						<pre className="whitespace-pre-wrap p-6">{JSON.stringify(dataToDisplay, null, 2)}</pre>
					) : (
						pdfData && (
							<iframe
								src={pdfData}
								title="CV PDF"
								width="100%"
								height="100%"
								style={{ border: "none" }}
							/>
						)
					)}
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
