import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Check, Copy, Download, Pencil, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import CVActions, { type Action } from "@/components/documents/cv-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCV } from "@/hooks/api-hooks/useCV";
import { getDocumentThumbnailUrl } from "@/lib/documents/utils";
import { cvContainerVariants, cvItemVariants } from "@/lib/framer/animations";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { createCVDocument, getCVDocuments } from "@/lib/supabase/documents/cvs";
import type { SupabaseOutletContext } from "@/lib/supabase/supabase";
import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import { cn } from "@/lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.cvs.all],
		queryFn: () => getCVDocuments({ supabase }),
	});

	return { dehydratedState: dehydrate(queryClient) };
}

function CVList() {
	const { supabase, user } = useOutletContext<SupabaseOutletContext>();
	const { cvs } = useCV({ supabase });

	const navigate = useNavigate();

	async function handleCreateNewDocument(fromProfile?: boolean) {
		try {
			const newDocument = await createCVDocument({ supabase, cvName: "New CV", fromProfile });
			if ("id" in newDocument && newDocument.id) {
				navigate(`/cvs/${newDocument.id}`);
			} else throw new Error("No document ID returned");
		} catch (_error) {
			toast.error("Error creating new document");
		}
	}

	function handleOpenCV(id: string) {
		navigate(`/cvs/${id}`, { viewTransition: true });
	}

	return (
		<div className="flex flex-wrap gap-4 justify-center">
			<Card className="document-card border-dashed border-muted-foreground border flex flex-col items-center justify-center gap-3 relative overflow-hidden">
				<div className="font-semibold text-center">Create New CV</div>
				<div className="flex flex-col gap-2 w-full px-2">
					<Button variant="outline" className="w-full" onClick={() => handleCreateNewDocument(true)}>
						From profile
					</Button>
					<Button variant="outline" className="w-full" onClick={() => handleCreateNewDocument(false)}>
						From scratch
					</Button>
				</div>
			</Card>
			<motion.div variants={cvContainerVariants} initial="hidden" animate="show" className="contents">
				{cvs?.data?.map((cv: any, _idx: number) => (
					<CVCard key={cv.id} cv={cv} supabase={supabase} user={user as User} handleOpenCV={handleOpenCV} />
				))}
			</motion.div>
		</div>
	);
}

function CVCard({
	cv,
	supabase,
	user,
	handleOpenCV,
}: {
	cv: any;
	supabase: SupabaseClient;
	user: User;
	handleOpenCV: (id: string) => void;
}) {
	const thumbnail = getDocumentThumbnailUrl({
		supabase,
		userId: user?.id,
		docType: "cvs",
		docId: cv.id,
	});

	const [isFallback, setIsFallback] = useState(false);

	return (
		<motion.div
			layout
			layoutId={`cv-card-${cv.id}`}
			exit="exit"
			variants={cvItemVariants}
			custom={cv.id}
			style={{ viewTransitionName: `cv-card-${cv.id}` }}
		>
			<Card className="group relative overflow-hidden document-card shadow-sm hover:shadow-md transition-all duration-300 p-0 flex flex-col">
				<button
					onClick={() => handleOpenCV(cv.id)}
					className="absolute inset-0 z-10 focus:outline-none"
					tabIndex={0}
					aria-label={`View ${cv.title}`}
				/>
				<div className="h-0 flex-1 flex items-center justify-center w-full">
					<img
						src={thumbnail}
						alt={`${cv.title} preview`}
						className={cn("h-full object-cover rounded-t-md", isFallback && "dark:invert")}
						loading="lazy"
						onError={(e) => {
							setIsFallback(true);
							if (!isFallback) e.currentTarget.src = "/assets/fallback-small.svg";
						}}
					/>
				</div>

				<CVFooter cv={cv} supabase={supabase} user={user} />
			</Card>
		</motion.div>
	);
}

function CVFooter({ cv, supabase, user }: { cv: any; supabase: SupabaseClient; user: User }) {
	const [isRenaming, setIsRenaming] = useState(false);

	const { deleteCV, renameCV, duplicateCV } = useCV({ supabase, id: cv.id });

	function handleDeleteCV() {
		deleteCV({
			id: cv.id,
			onSuccess: () => {
				toast.info("CV deleted successfully");
			},
			onError: () => toast.error("Error deleting CV"),
		});
	}

	async function handleDownloadCV() {
		const filePath = `cvs/${user.id}/${cv.id}.pdf`;
		const { data, error } = await supabase.storage.from("documents").download(filePath);
		if (error) {
			toast.error("Error downloading CV");
			return;
		}
		if (!data) {
			toast.error("No CV found");
			return;
		}
		const url = URL.createObjectURL(data);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${cv.title}.pdf`;
		a.click();
	}

	// renaming logic
	const [cvName, setCvName] = useState(cv.title);

	function handleRenameCV() {
		if (!cvName) return;
		renameCV({
			id: cv.id,
			name: cvName,
			onSuccess: () => {
				setIsRenaming(false);
				toast.info("CV renamed");
			},
			onError: () => toast.error("Error renaming CV"),
		});
	}

	function handleCancelRenameCV() {
		setIsRenaming(false);
		setCvName(cv.title);
	}

	function onDuplicate() {
		duplicateCV({
			id: cv.id,
			onSuccess: () => {
				toast.info("CV duplicated successfully");
			},
		});
	}

	const actions: Action[] = [
		{
			label: "Rename",
			icon: <Pencil className="h-4 w-4 mr-2" />,
			onClick: () => setIsRenaming(true),
		},
		{
			label: "Duplicate",
			icon: <Copy className="h-4 w-4 mr-2" />,
			onClick: onDuplicate,
		},
		{
			label: "Export",
			icon: <Download className="h-4 w-4 mr-2" />,
			onClick: handleDownloadCV,
		},
	];

	return (
		<div className="relative z-20 min-h-[56px] flex items-center justify-between px-3 py-2 bg-white/80 dark:bg-card/80 backdrop-blur border-t border-border">
			<span className="text-base font-medium truncate" title={cv.title}>
				{isRenaming ? (
					<div className="flex items-center gap-1">
						<Input
							className="ring-inset"
							value={cvName}
							onChange={(e) => setCvName(e.target.value)}
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
					cvName
				)}
			</span>
			{!isRenaming && <CVActions actions={actions} onDelete={handleDeleteCV} />}
		</div>
	);
}

export default function CVs() {
	const { dehydratedState } = useLoaderData<typeof loader>();

	return (
		<div className="gap-4 flex flex-wrap justify-center sm:justify-start">
			<HydrationBoundary state={dehydratedState}>
				<CVList />
			</HydrationBoundary>
		</div>
	);
}
