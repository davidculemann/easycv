import type { TypedSupabaseClient } from "@/lib/supabase/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

export type DocType = "cvs" | "cover_letters";

interface UploadParams {
	file: File;
	docType: DocType;
	userId: string;
}

export function useUploadDocument({ supabase }: { supabase: TypedSupabaseClient }) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ file, docType, userId }: UploadParams) => {
			const fileId = uuidv4();
			const filePath = `${docType}/${userId}/${fileId}.pdf`;

			const { error } = await supabase.storage.from("documents").upload(filePath, file, {
				cacheControl: "3600",
				upsert: false,
			});

			if (error) throw error;

			return { filePath, fileId };
		},
		onSuccess: (_, { docType, userId }) => queryClient.invalidateQueries({ queryKey: [docType, userId] }),
	});
}
