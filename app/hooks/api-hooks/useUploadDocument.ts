import type { TypedSupabaseClient } from "@/lib/supabase/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type DocType = "cvs" | "cover_letters";

interface UploadParams {
	file: File;
	docType: DocType;
	userId: string;
	cvId: string;
}

export function useUploadDocument({ supabase }: { supabase: TypedSupabaseClient }) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ file, docType, userId, cvId }: UploadParams) => {
			const filePath = `${docType}/${userId}/${cvId}.pdf`;

			const { error } = await supabase.storage.from("documents").upload(filePath, file, {
				cacheControl: "3600",
				upsert: true,
			});

			if (error) throw error;

			return { filePath, cvId };
		},
		onSuccess: (_, { docType, userId }) => queryClient.invalidateQueries({ queryKey: [docType, userId] }),
	});
}
