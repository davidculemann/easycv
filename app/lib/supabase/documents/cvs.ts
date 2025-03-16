import type { CVContext } from "@/lib/documents/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "db_types";

export async function getCVDocuments({
	supabase,
	limit = 100,
	offset = 0,
}: {
	supabase: SupabaseClient<Database>;
	limit?: number;
	offset?: number;
}) {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not found");
	}

	const { data, error, count } = await supabase
		.from("cvs")
		.select("id, title, created_at", { count: "exact" })
		.eq("user_id", user.id)
		.range(offset, offset + limit - 1);

	if (error) {
		throw new Error(error.message);
	}

	return {
		data,
		count,
		hasMore: count ? offset + limit < count : false,
	};
}

//get the last 3 created/edited cover letters and cvs
export async function getLastThreeDocuments({ supabase }: { supabase: SupabaseClient<Database> }) {
	const { data, error } = await supabase
		.from("cvs")
		.select("id, title, created_at")
		.order("created_at", { ascending: false })
		.limit(3);

	if (error) {
		throw new Error(error.message);
	}

	const { data: coverLetters, error: coverLetterError } = await supabase
		.from("cover_letters")
		.select("id, title, created_at")
		.order("created_at", { ascending: false })
		.limit(3);

	if (coverLetterError) {
		throw new Error(coverLetterError.message);
	}

	return {
		cvs: data,
		coverLetters: coverLetters,
	};
}

export async function getCVDocument({ supabase, id }: { supabase: SupabaseClient<Database>; id: string }) {
	const { data, error } = await supabase.from("cvs").select("*").eq("id", id).single();
	if (error) {
		throw new Error(error.message);
	}

	function formatCV(cv: Database["public"]["Tables"]["cvs"]["Row"]) {
		return {
			id: cv.id,
			title: cv.title,
			created_at: cv.created_at,
			cv: {
				education: cv.education,
				experience: cv.experience,
				skills: cv.skills,
				projects: cv.projects,
				summary: cv.summary,
				languages: cv.languages,
				interests: cv.interests,
			},
		};
	}

	return formatCV(data);
}

export async function createCVDocument({ supabase }: { supabase: SupabaseClient<Database> }) {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not found");
	}

	const { data, error } = await supabase.from("cvs").insert({ user_id: user.id, title: "New CV" }).select().single();
	if (error) {
		throw new Error(error.message);
	}

	return data;
}

export async function deleteCVDocument({ supabase, id }: { supabase: SupabaseClient<Database>; id: string }) {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not found");
	}

	const { data, error } = await supabase.from("cvs").delete().eq("id", id);
	if (error) {
		throw new Error(error.message);
	}

	return data;
}

export async function updateCVDocument({
	supabase,
	id,
	cv,
}: { supabase: SupabaseClient<Database>; id: string; cv: Partial<CVContext> }) {
	const { education, experience, skills, projects } = cv;
	const { data, error } = await supabase
		.from("cvs")
		.update({
			education: education,
			experience: experience,
			skills: skills,
			projects: projects,
		})
		.eq("id", id)
		.select();
	if (error) {
		throw new Error(error.message);
	}
	return data[0];
}
