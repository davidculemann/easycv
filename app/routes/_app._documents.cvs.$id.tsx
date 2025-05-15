import { EducationForm } from "@/components/forms/profile/education-form";
import { ExperienceForm } from "@/components/forms/profile/experience-form";
import { ensureValidProfile } from "@/components/forms/profile/logic/types";
import {
	getEducationFormData,
	getExperienceFormData,
	getProjectsFormData,
	getSkillsFormData,
	sectionNames,
	sectionOrder,
} from "@/components/forms/profile/logic/utils";
import { PersonalInfoForm } from "@/components/forms/profile/personal-info-form";
import { ProjectsForm } from "@/components/forms/profile/projects-form";
import { SkillsForm } from "@/components/forms/profile/skills-form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCV } from "@/hooks/api-hooks/useCV";
import { type CVContext, CVContextSchema } from "@/lib/documents/types";
import { getUserProfile } from "@/lib/supabase/documents/profile";
import type { SupabaseOutletContext } from "@/lib/supabase/supabase";
import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useNavigate, useOutletContext, useParams } from "@remix-run/react";
import { AlertTriangle, Check, Download, ExternalLink, Pencil, RefreshCw, Settings, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";
import { z } from "zod";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });

	try {
		const profile = await getUserProfile({ supabase });
		return { profile: ensureValidProfile(profile) };
	} catch (error) {
		console.error("Error loading profile:", error);
		return { profile: ensureValidProfile(null) };
	}
}

export default function CV() {
	const { supabase, subscription } = useOutletContext<SupabaseOutletContext>();
	const { profile } = useLoaderData<typeof loader>();
	const params = useParams();
	const { id } = params;
	const { updateCV, isUpdatingCV, cv, deleteCV, isDeletingCV, renameCV, optimisticCvTitle } = useCV({
		supabase,
		id: id ?? "",
	});

	const isMobile = useMediaQuery("(max-width: 768px)");
	const [model, setModel] = useState("deepseek");
	const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
	const [pdfData, setPdfData] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<"json" | "pdf">("json");
	const [isEditingName, setIsEditingName] = useState(false);
	const [isSaved, setIsSaved] = useState(true);
	const nameInputRef = useRef<HTMLInputElement>(null);
	const [activeTab, setActiveTab] = useState("personal");

	const { isLoading, object, submit } = useObject({
		api: "/api/cv/generate",
		schema: z.object({
			cv: CVContextSchema,
		}),
	});

	function handleSaveChanges() {
		if (!object) return;
		updateCV({ id: id ?? "", cv: object.cv as CVContext });
	}

	const dataToDisplay = ensureValidProfile(object?.cv ?? profile);

	useEffect(() => {
		setPdfData(null);
		setViewMode("json");
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
				} catch (e) {
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
				profile: profile,
			},
			model,
		});
	}

	// === cv naming ===
	const [cvName, setCvName] = useState(optimisticCvTitle);

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

	useEffect(() => {
		if (optimisticCvTitle) {
			setCvName(optimisticCvTitle);
		}
	}, [optimisticCvTitle]);

	// === profile banner ===
	const [profileDismissed, setProfileDismissed] = useState(false);
	const showBanner = !profile.completed && !profileDismissed;

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

	return (
		<div className="h-full flex flex-col">
			<div className="border-b px-4 py-3 flex items-center justify-between bg-background [height:62px]">
				{isEditingName ? (
					<div className="flex items-center gap-1">
						<input
							ref={nameInputRef}
							value={cvName}
							onChange={(e) => setCvName(e.target.value)}
							className="h-9 text-lg font-medium w-[150px] md:w-[200px] border rounded px-2"
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
							onClick={() => setIsEditingName(false)}
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
					<Button variant="outline" size="sm" className="gap-2">
						<Settings className="h-4 w-4" />
						<span className="hidden sm:inline">AI Settings</span>
					</Button>

					<Popover open={deleteCVPopoverOpen} onOpenChange={setDeleteCVPopoverOpen}>
						<PopoverTrigger asChild>
							<Button variant="outline" size="sm" className="gap-2">
								<Trash2 className="h-4 w-4" />
								<span className="hidden sm:inline">Delete CV</span>
							</Button>
						</PopoverTrigger>
						<PopoverContent className="flex flex-col gap-3">
							<span className="text-sm">Delete this CV?</span>
							<span className="text-sm text-muted-foreground">This action cannot be undone.</span>
							<div className="flex items-center gap-2 justify-end">
								<Button
									variant="outline"
									size="sm"
									className="gap-2"
									onClick={() => setDeleteCVPopoverOpen(false)}
								>
									Cancel
								</Button>
								<Button variant="destructive" size="sm" className="gap-2" onClick={handleDeleteCV}>
									Delete CV
								</Button>
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>
			{showBanner && (
				<div className="bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border-b px-4 py-2">
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
								onClick={() => setProfileDismissed(false)}
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			)}

			<ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"} className="flex-1">
				<ResizablePanel defaultSize={40} minSize={30}>
					<div className="h-full flex flex-col bg-background w-full max-w-full flex-1 min-h-0">
						<Tabs
							value={activeTab}
							onValueChange={(v) => setActiveTab(v as typeof activeTab)}
							className="flex-1 min-h-0 flex flex-col w-full max-w-full"
						>
							<div className="border-b bg-background p-2 w-full mx-auto @container">
								<div className="hidden @[530px]:block">
									<TabsList className="flex w-full max-w-full">
										{sectionOrder.map((section) => (
											<TabsTrigger key={section} value={section} className="min-w-[90px] flex-1">
												{sectionNames[section]}
											</TabsTrigger>
										))}
									</TabsList>
								</div>
								<div className="block @[530px]:hidden">
									<Select
										value={activeTab}
										onValueChange={(v) => setActiveTab(v as typeof activeTab)}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Section" />
										</SelectTrigger>
										<SelectContent>
											{sectionOrder.map((section) => (
												<SelectItem key={section} value={section}>
													{sectionNames[section]}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className="flex-1 min-h-0 overflow-y-auto p-4 w-full max-w-full">
								<TabsContent value="personal" className="mt-0">
									<PersonalInfoForm
										defaultValues={{
											firstName: dataToDisplay?.first_name || "",
											lastName: dataToDisplay?.last_name || "",
											email: dataToDisplay?.email || "",
											phone: dataToDisplay?.phone || "",
											address: dataToDisplay?.address || "",
											linkedin: dataToDisplay?.linkedin || "",
											github: dataToDisplay?.github || "",
											website: dataToDisplay?.website || "",
										}}
										formType="personal"
									/>
								</TabsContent>
								<TabsContent value="experience" className="mt-0">
									<ExperienceForm
										defaultValues={getExperienceFormData(dataToDisplay)}
										formType="experience"
									/>
								</TabsContent>
								<TabsContent value="education" className="mt-0">
									<EducationForm
										defaultValues={getEducationFormData(dataToDisplay)}
										formType="education"
									/>
								</TabsContent>
								<TabsContent value="projects" className="mt-0">
									<ProjectsForm
										defaultValues={getProjectsFormData(dataToDisplay)}
										formType="projects"
									/>
								</TabsContent>
								<TabsContent value="skills" className="mt-0">
									<SkillsForm defaultValues={getSkillsFormData(dataToDisplay)} formType="skills" />
								</TabsContent>
							</div>
						</Tabs>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />

				<ResizablePanel>
					<div className="h-full flex flex-col w-full max-w-full">
						<Tabs
							value={viewMode}
							onValueChange={(v) => setViewMode(v as "json" | "pdf")}
							className="flex-1 flex flex-col w-full max-w-full"
						>
							<div className="border-b p-2 flex items-center justify-between bg-background overflow-x-auto">
								<TabsList className="gap-2">
									<TabsTrigger value="pdf" className="flex gap-2">
										PDF View
									</TabsTrigger>
									<TabsTrigger value="json" className="flex gap-2">
										JSON View
									</TabsTrigger>
								</TabsList>
								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => generatePDF(false)}
										disabled={isGeneratingPdf}
										className="flex gap-2"
									>
										<RefreshCw className="h-4 w-4" />
										<span className="hidden sm:inline">
											{isGeneratingPdf ? "Generating..." : "Refresh PDF"}
										</span>
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
							<TabsContent
								value="pdf"
								className="flex-1 overflow-auto w-full max-w-full"
								style={{ background: "var(--color-warning)" }}
							>
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
							</TabsContent>
							<TabsContent
								value="json"
								className="flex-1 bg-popover overflow-x-auto w-full max-w-full mt-0"
							>
								<pre className="p-4 text-sm min-w-[300px] max-w-full overflow-x-auto whitespace-pre-wrap">
									{JSON.stringify(dataToDisplay, null, 2)}
								</pre>
							</TabsContent>
						</Tabs>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
