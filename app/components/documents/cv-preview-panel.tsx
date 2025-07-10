import { Download, RefreshCw, Upload } from "lucide-react";
import type { ParsedCVProfile } from "@/components/forms/profile/logic/types";
import { Button } from "@/components/ui/button";

interface CVPreviewPanelProps {
	cv: ParsedCVProfile | null | undefined;
	pdfData: string | null;
	setPdfData: (url: string | null) => void;
	generatePDF: (download?: boolean) => void;
	handleUploadCV: () => void;
	isGeneratingPdf: boolean;
	user: { id: string } | null | undefined;
	id: string | undefined;
}

export function CVPreviewPanel({
	pdfData,
	generatePDF,
	handleUploadCV,
	isGeneratingPdf,
	user,
	id,
}: CVPreviewPanelProps) {
	return (
		<div className="flex-1 flex flex-col w-full max-w-full" style={{ viewTransitionName: `cv-card-${id}` }}>
			<div className="border-b p-2 pr-4 flex items-center justify-between bg-background overflow-x-auto h-[53px]">
				<div className="flex items-center gap-2 w-full justify-end">
					<Button
						variant="outline"
						size="sm"
						onClick={handleUploadCV}
						className="flex gap-2"
						disabled={!pdfData || !user?.id}
					>
						<Upload className="h-4 w-4" />
						<span className="hidden sm:inline">Upload CV</span>
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => generatePDF(false)}
						disabled={isGeneratingPdf}
						className="flex gap-2"
					>
						<RefreshCw className="h-4 w-4" />
						<span className="hidden sm:inline">{isGeneratingPdf ? "Generating..." : "Refresh PDF"}</span>
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => generatePDF(true)}
						disabled={isGeneratingPdf}
						className="flex gap-2"
					>
						<Download className="h-4 w-4" />
						<span className="hidden sm:inline">Download PDF</span>
					</Button>
				</div>
			</div>
			<div className="flex-1 overflow-auto w-full max-w-full" style={{ background: "var(--color-warning)" }}>
				{pdfData ? (
					<iframe
						src={pdfData}
						title="CV PDF"
						className="w-full h-full max-w-[600px] mx-auto shadow-md"
						style={{ border: "none", background: "var(--color-warning)" }}
					/>
				) : (
					<div className="flex items-center justify-center h-full text-muted-foreground">
						No PDF generated yet.
					</div>
				)}
			</div>
		</div>
	);
}

export default CVPreviewPanel;
