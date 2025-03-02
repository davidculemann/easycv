import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useCV = () => {
	const { data: cvs } = useQuery({
		queryKey: [QUERY_KEYS.cvs.all],
		queryFn: () => axios.get("/api/cv"),
	});

	const { mutate: createCV, isPending: isCreatingCV } = useMutation({
		mutationFn: () => axios.post("/api/cv"),
		mutationKey: [QUERY_KEYS.cvs.all],
	});

	const { mutate: deleteCV, isPending: isDeletingCV } = useMutation({
		mutationFn: (id: string) => axios.delete(`/api/cv/${id}`),
		mutationKey: [QUERY_KEYS.cvs.all],
	});

	return { createCV, isCreatingCV, deleteCV, isDeletingCV, cvs: cvs?.data?.cvs };
};
