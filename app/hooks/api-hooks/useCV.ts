import type { ParsedCVProfile } from "@/components/forms/profile/logic/types";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import {
	createCVDocument,
	deleteCVDocument,
	duplicateCVDocument,
	getCVDocument,
	getCVDocuments,
	renameCVDocument,
	updateCVDocument,
} from "@/lib/supabase/documents/cvs";
import type { TypedSupabaseClient } from "@/lib/supabase/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCV = ({ supabase, id }: { supabase: TypedSupabaseClient; id?: string }) => {
	const { data: cvs } = useQuery({
		queryKey: [QUERY_KEYS.cvs.all],
		queryFn: () => getCVDocuments({ supabase }),
		enabled: !id,
	});

	const { data: cv } = useQuery({
		queryKey: [QUERY_KEYS.cvs.single, id],
		queryFn: () => getCVDocument({ supabase, id: id as string }),
		enabled: Boolean(id),
	});

	const { mutate: deleteCV, isPending: isDeletingCV } = useMutation({
		mutationFn: ({ id, onSuccess, onError }: { id: string; onSuccess?: () => void; onError?: () => void }) =>
			deleteCVDocument({ supabase, id, onSuccess, onError }),
		mutationKey: [QUERY_KEYS.cvs.all],
	});

	const {
		mutate: renameCV,
		isPending: isRenamingCV,
		variables,
	} = useMutation({
		mutationFn: ({
			id,
			name,
			onSuccess,
			onError,
		}: { id: string; name: string; onSuccess?: () => void; onError?: () => void }) =>
			renameCVDocument({ supabase, id, name, onSuccess, onError }),
	});

	const { mutate: updateCV, isPending: isUpdatingCV } = useMutation({
		mutationFn: ({ id, cv }: { id: string; cv: Partial<ParsedCVProfile> }) =>
			updateCVDocument({ supabase, id, cv }),
		mutationKey: [QUERY_KEYS.cvs.single, id],
	});

	const { mutate: createCV, isPending: isCreatingCV } = useMutation({
		mutationFn: async ({
			cvName,
			fromProfile,
			onSuccess,
			onError,
		}: {
			cvName?: string;
			fromProfile?: boolean;
			onSuccess?: (data: any) => void;
			onError?: (error: any) => void;
		}) => {
			try {
				const data = await createCVDocument({ supabase, cvName, fromProfile });
				onSuccess?.(data);
				return data;
			} catch (error) {
				onError?.(error);
				throw error;
			}
		},
	});

	const { mutate: duplicateCV, isPending: isDuplicatingCV } = useMutation({
		mutationFn: ({ id, onSuccess, onError }: { id: string; onSuccess?: () => void; onError?: () => void }) =>
			duplicateCVDocument({ supabase, id, onSuccess, onError }),
		mutationKey: [QUERY_KEYS.cvs.all],
	});

	return {
		deleteCV,
		isDeletingCV,
		cvs,
		cv,
		updateCV,
		isUpdatingCV,
		renameCV,
		isRenamingCV,
		optimisticCvTitle: variables?.name ?? cv?.title,
		createCV,
		isCreatingCV,
		duplicateCV,
		isDuplicatingCV,
	};
};
