import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useCV } from "@/hooks/api-hooks/useCV";
import { getDocumentThumbnailUrl } from "@/lib/documents/utils";
import { cvContainerVariants, cvItemVariants } from "@/lib/framer/animations";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { createCVDocument, getCVDocuments } from "@/lib/supabase/documents/cvs";
import type { SupabaseOutletContext } from "@/lib/supabase/supabase";
import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { Check, Copy, Download, MoreVertical, Pencil, Trash2, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.cvs.all],
		queryFn: () => getCVDocuments({ supabase }),
	});

	return json({ dehydratedState: dehydrate(queryClient) });
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
		} catch (error) {
			toast.error("Error creating new document");
		}
	}

	function handleOpenCV(id: string) {
		navigate(`/cvs/${id}`, { viewTransition: true });
	}

	return (
		<div className="flex flex-wrap gap-4 justify-center sm:justify-start">
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
				{cvs?.data?.map((cv: any, idx: number) => (
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
}: { cv: any; supabase: SupabaseClient; user: User; handleOpenCV: (id: string) => void }) {
	const thumbnail = getDocumentThumbnailUrl({
		supabase,
		userId: user?.id,
		docType: "cvs",
		docId: cv.id,
	});

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
				<div className="h-0 flex-1 flex items-center justify-center p-1 w-full">
					<img
						src={thumbnail}
						alt={`${cv.title} preview`}
						className="w-full h-full rounded-t-md"
						loading="lazy"
						onError={(e) => {
							e.currentTarget.src = "/assets/fallback.svg";
						}}
					/>
				</div>

				<CVFooter cv={cv} supabase={supabase} user={user} />
			</Card>
		</motion.div>
	);
}

function CVFooter({ cv, supabase, user }: { cv: any; supabase: SupabaseClient; user: User }) {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isRenaming, setIsRenaming] = useState(false);

	const { deleteCV, renameCV, duplicateCV } = useCV({ supabase, id: cv.id });

	function handleDeleteCV() {
		deleteCV({
			id: cv.id,
			onSuccess: () => {
				toast("CV deleted successfully");
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
				toast.success("CV renamed");
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
				toast.success("CV duplicated successfully");
			},
		});
	}

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
			{!isRenaming && (
				<DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 p-0 rounded-full"
							tabIndex={0}
							aria-label="CV Actions"
						>
							<MoreVertical className="h-5 w-5" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48">
						<DropdownMenuGroup>
							<DropdownMenuItem
								onClick={(e) => {
									e.preventDefault();
									setIsRenaming(true);
								}}
							>
								<Pencil className="h-4 w-4 mr-2" /> Rename
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={(e) => {
									e.preventDefault();
									onDuplicate();
								}}
							>
								<Copy className="h-4 w-4 mr-2" /> Duplicate
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={(e) => {
									e.preventDefault();
									handleDownloadCV();
								}}
							>
								<Download className="h-4 w-4 mr-2" /> Export
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-red-600 focus:text-red-600 focus:bg-red-50"
								onClick={(e) => {
									e.preventDefault();
									handleDeleteCV();
								}}
							>
								<Trash2 className="h-4 w-4 mr-2" /> Delete
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
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
