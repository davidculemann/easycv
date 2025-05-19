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
import { Copy, Download, MoreVertical, Pencil, Trash2 } from "lucide-react";
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
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const thumbnail = getDocumentThumbnailUrl({
		supabase,
		userId: user?.id,
		docType: "cvs",
		docId: cv.id,
	});

	const onRename = () => {};
	const onDuplicate = () => {};
	const onExport = () => {};
	const onDelete = () => {};

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
					{thumbnail ? (
						<img
							src={thumbnail}
							alt={`${cv.title} preview`}
							className="w-full h-full rounded-md"
							loading="lazy"
							onError={(e) => {
								e.currentTarget.src = "/assets/fallback.svg";
							}}
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground rounded-md">
							No Preview
						</div>
					)}
				</div>
				<div className="relative z-20 min-h-[56px] flex items-center justify-between px-3 py-2 bg-white/80 dark:bg-card/80 backdrop-blur border-t border-border">
					<span className="text-base font-medium truncate max-w-[70%]" title={cv.title}>
						{cv.title}
					</span>
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
										onRename();
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
										onExport();
									}}
								>
									<Download className="h-4 w-4 mr-2" /> Export
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="text-red-600 focus:text-red-600 focus:bg-red-50"
									onClick={(e) => {
										e.preventDefault();
										onDelete();
									}}
								>
									<Trash2 className="h-4 w-4 mr-2" /> Delete
								</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</Card>
		</motion.div>
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
