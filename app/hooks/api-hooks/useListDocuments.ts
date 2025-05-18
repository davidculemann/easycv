import type { TypedSupabaseClient } from "@/lib/supabase/supabase";
import { useQuery } from "@tanstack/react-query";
import type { DocType } from "./useUploadDocument";

interface DocumentEntry {
	name: string;
	url: string;
	thumbnailUrl?: string;
}

export function useListDocuments({
	docType,
	userId,
	supabase,
}: { docType: DocType; userId: string; supabase: TypedSupabaseClient }) {
	return useQuery<DocumentEntry[]>({
		queryKey: [docType, userId],
		queryFn: async () => {
			const { data, error } = await supabase.storage
				.from("documents")
				.list(`${docType}/${userId}`, { limit: 100 });

			if (error) throw error;

			const entries: DocumentEntry[] = await Promise.all(
				((data ?? []) as DocumentEntry[])
					.filter((item) => item.name.endsWith(".pdf"))
					.map(async (item) => {
						const filePath = `${docType}/${userId}/${item.name}`;
						const { data: urlData } = supabase.storage.from("documents").getPublicUrl(filePath);

						const thumbPath = `${docType}/${userId}/thumbs/${item.name.replace(".pdf", ".jpg")}`;
						const { data: thumbData } = supabase.storage.from("documents").getPublicUrl(thumbPath);

						return {
							name: item.name,
							url: urlData?.publicUrl ?? "",
							thumbnailUrl: thumbData?.publicUrl ?? undefined,
						};
					}),
			);

			return entries;
		},
	});
}
