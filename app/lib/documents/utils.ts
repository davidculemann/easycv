import type { TypedSupabaseClient } from "../supabase/supabase";

export function getDocumentThumbnailUrl({
	supabase,
	userId,
	docType,
	docId,
}: {
	supabase: TypedSupabaseClient;
	userId: string | undefined;
	docType: string;
	docId: string;
}) {
	const { data } = supabase.storage.from("documents").getPublicUrl(`${docType}/${userId}/${docId}.jpg`);

	return data?.publicUrl ?? "";
}
