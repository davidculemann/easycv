import { experimental_useObject as useObject } from "@ai-sdk/react";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { AlertTriangle, Check, ExternalLink, Pencil, Settings2, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Link, useLoaderData, useNavigate, useOutletContext, useParams } from "react-router";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";
import { z } from "zod";
import AIPreferencesModal from "@/components/documents/ai-preferences-modal";
import CVFormPanel from "@/components/documents/cv-form-panel";
import CVPreviewPanel from "@/components/documents/cv-preview-panel";
import DeleteDocumentConfirmation from "@/components/documents/delete-document-confirmation";
import { ensureValidProfile } from "@/components/forms/profile/logic/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { bannerVariants } from "@/lib/framer/animations";
import { useCV } from "@/hooks/api-hooks/useCV";
import { useUploadDocument } from "@/hooks/api-hooks/useUploadDocument";
import { type CVContext, CVContextSchema } from "@/lib/documents/types";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { getCVDocuments } from "@/lib/supabase/documents/cvs";
import type { SupabaseOutletContext } from "@/lib/supabase/supabase";
import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not found");
	}

	const url = new URL(request.url);
	const id = url.searchParams.get("id");

	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.cvs.single, id],
		queryFn: () => getCVDocuments({ supabase }),
	});

	const { data } = await supabase.from("cv_profiles").select("completed").eq("user_id", user.id).single();

	return { dehydratedState: dehydrate(queryClient), profileCompleted: data?.completed };
}

export function CV({ profileCompleted }: { profileCompleted: boolean }) {
	const { supabase, user } = useOutletContext<SupabaseOutletContext>();
	const params = useParams();
	const { id } = params as { id: string };
	const { updateCV, isUpdatingCV, cv, deleteCV, renameCV } = useCV({
		supabase,
		id,
	});

	const isMobile = useMediaQuery("(max-width: 768px)");
	const [model, _setModel] = useState("deepseek");
	const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
	const [pdfData, setPdfData] = useState<string | null>(null);
	const [isEditingName, setIsEditingName] = useState(false);
	const [isSaved, _setIsSaved] = useState(true);
	const [activeTab, setActiveTab] = useState("personal");

	const { object, submit } = useObject({
		api: "/api/cv/generate",
		schema: z.object({
			cv: CVContextSchema,
		}),
	});

	function _handleSaveChanges() {
		if (!object) return;
		updateCV({ id, cv: object.cv as CVContext });
	}

	const dataToDisplay = object?.cv || cv;

	useEffect(() => {
		setPdfData(null);
	}, [id]);

	const generatePDF = async (download = false) => {
		if (!dataToDisplay) return;

		try {
			setIsGeneratingPdf(true);
			const formData = new FormData();
			formData.append("cvId", id || "");
			formData.append("cvData", JSON.stringify(dataToDisplay));

			const response = await fetch("/api/cv/pdf-latex", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const errorBuffer = await response.arrayBuffer();
				const errorText = new TextDecoder().decode(errorBuffer);
				console.error("Error response:", errorText);

				let errorMessage = "Failed to generate PDF";
				try {
					const errorData = JSON.parse(errorText);
					errorMessage = errorData.error || errorMessage;
				} catch (_e) {
					errorMessage = errorText || errorMessage;
				}

				throw new Error(errorMessage);
			}

			const blob = await response.blob();

			if (download) {
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
				const url = window.URL.createObjectURL(blob);
				setPdfData(url);
				toast.success("PDF generated successfully");
			}
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to generate PDF");
			console.error(error);
		} finally {
			setIsGeneratingPdf(false);
		}
	};

	function _handleGenerateCV() {
		submit({
			context: {
				profile: dataToDisplay,
			},
			model,
		});
	}

	// === cv naming ===
	const [cvName, setCvName] = useState(cv?.title);

	useEffect(() => {
		setCvName(cv?.title);
	}, [cv]);

	function handleRenameCV() {
		if (!cvName) return;
		renameCV({
			id: id ?? "",
			name: cvName,
			onSuccess: () => {
				setIsEditingName(false);
				toast.success("CV renamed");
			},
			onError: () => toast.error("Error renaming CV"),
		});
	}

	function handleCancelRenameCV() {
		setIsEditingName(false);
		setCvName(cv?.title);
	}

	// === profile banner ===
	const [profileDismissed, setProfileDismissed] = useState(false);
	const showBanner = !profileCompleted && !profileDismissed;

	// === delete cv ===
	const [deleteCVPopoverOpen, setDeleteCVPopoverOpen] = useState(false);
	const navigate = useNavigate();

	function handleDeleteCV() {
		deleteCV({
			id: id ?? "",
			onSuccess: () => {
				toast.success("CV deleted successfully");
				navigate("/cvs");
			},
			onError: () => toast.error("Failed to delete CV"),
		});
	}

	const { mutate: uploadCV } = useUploadDocument({ supabase });

	async function handleUploadCV() {
		if (!pdfData || !user?.id) return;

		const response = await fetch(pdfData);
		if (!response.ok) throw new Error("Failed to fetch generated PDF");

		const pdfBlob = await response.blob();
		const file = new File([pdfBlob], `cv-${id}.pdf`, {
			type: "application/pdf",
		});

		uploadCV({
			file,
			docType: "cvs",
			userId: user.id,
			cvId: id ?? "",
		});
	}

	const parsedCV = cv ? ensureValidProfile(cv.cv) : undefined;

	return (
		<div className="h-full flex flex-col">
			<div className="border-b px-4 py-3 flex items-center justify-between bg-background [height:62px]">
				{isEditingName ? (
					<div className="flex items-center gap-1">
						<Input
							value={cvName}
							onChange={(e) => setCvName(e.target.value)}
							className="h-9 text-lg font-medium w-[150px] md:w-[200px] border rounded px-2"
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleRenameCV();
								}
							}}
						/>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleRenameCV}
							className="h-8 w-8 p-0 text-green-600"
						>
							<Check className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleCancelRenameCV}
							className="h-8 w-8 p-0 text-red-600"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				) : (
					<h1 className="text-xl font-semibold flex items-center gap-2">
						{cvName}
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsEditingName(true)}
							className="h-7 w-7 p-0 opacity-50 hover:opacity-100"
						>
							<Pencil className="h-3.5 w-3.5" />
						</Button>
					</h1>
				)}
				<div className="flex items-center gap-2">
					<div className="flex items-center text-muted-foreground mr-2">
						<div className={`w-2 h-2 rounded-full mr-1 ${isSaved ? "bg-green-500" : "bg-amber-500"}`} />
						<span className="hidden sm:inline">{isSaved ? "Saved" : "Saving..."}</span>
					</div>
					<AIPreferencesModal
						trigger={
							<Button variant="outline" size="sm" className="gap-2">
								<Settings2 className="h-4 w-4" />
								<span className="hidden sm:inline">AI Preferences</span>
							</Button>
						}
					/>

					<DeleteDocumentConfirmation
						open={deleteCVPopoverOpen}
						onOpenChange={setDeleteCVPopoverOpen}
						onDelete={handleDeleteCV}
						documentType="CV"
					>
						<Button
							variant="outline"
							size="sm"
							className="gap-2"
							onClick={() => setDeleteCVPopoverOpen(true)}
						>
							<Trash2 className="h-4 w-4" />
							<span className="hidden sm:inline">Delete CV</span>
						</Button>
					</DeleteDocumentConfirmation>
				</div>
			</div>
			<motion.div layout>
				<AnimatePresence>
					{showBanner && (
						<motion.div
							variants={bannerVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
							className="bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border-b px-4 py-2"
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<AlertTriangle className="h-4 w-4 text-warning-foreground" />
									<span className="text-sm text-warning-foreground">
										Complete your profile first to save your profile for future documents!
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Link to="/profile" className="text-sm hover:underline flex items-center gap-1">
										<ExternalLink className="h-3 w-3 ml-1" />
										<span className="hidden sm:inline">Go to Profile</span>
									</Link>
									<Button
										variant="ghost"
										size="sm"
										className="h-7 w-7 p-0"
										onClick={() => setProfileDismissed(true)}
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>

			<ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"} className="flex-1">
				<ResizablePanel defaultSize={40} minSize={30}>
					<div className="h-full flex flex-col bg-background w-full max-w-full flex-1 min-h-0">
						<CVFormPanel
							cv={parsedCV}
							updateCV={updateCV}
							isUpdatingCV={isUpdatingCV}
							activeTab={activeTab}
							setActiveTab={setActiveTab}
							id={id}
						/>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel>
					<div className="h-full flex flex-col w-full max-w-full">
						<CVPreviewPanel
							cv={parsedCV}
							pdfData={pdfData}
							setPdfData={setPdfData}
							generatePDF={generatePDF}
							handleUploadCV={handleUploadCV}
							isGeneratingPdf={isGeneratingPdf}
							user={user}
							id={id}
						/>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}

export default function CVPage() {
	const { profileCompleted, dehydratedState } = useLoaderData<typeof loader>();

	return (
		<HydrationBoundary state={dehydratedState}>
			<CV profileCompleted={profileCompleted} />
		</HydrationBoundary>
	);
}
