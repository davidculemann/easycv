import type { ParsedCVProfile } from "@/components/forms/profile/logic/types";
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
export async function getLastXDocuments({
	supabase,
	limit = 5,
}: { supabase: SupabaseClient<Database>; limit: number }) {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not found");
	}

	const { data, error } = await supabase
		.from("cvs")
		.select("id, title, created_at, updated_at")
		.eq("user_id", user.id)
		.order("created_at", { ascending: false })
		.limit(limit);

	if (error) {
		throw new Error(error.message);
	}

	const { data: coverLetters, error: coverLetterError } = await supabase
		.from("cover_letters")
		.select("id, title, created_at, updated_at")
		.eq("user_id", user.id)
		.order("created_at", { ascending: false })
		.limit(limit);

	if (coverLetterError) {
		throw new Error(coverLetterError.message);
	}

	const { count: totalCvsCount } = await supabase
		.from("cvs")
		.select("*", { count: "exact", head: true })
		.eq("user_id", user.id);

	const { count: totalCoverLettersCount } = await supabase
		.from("cover_letters")
		.select("*", { count: "exact", head: true })
		.eq("user_id", user.id);

	return {
		cvs: data,
		coverLetters: coverLetters,
		totalCvs: totalCvsCount || 0,
		totalCoverLetters: totalCoverLettersCount || 0,
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

export async function deleteCVDocument({
	supabase,
	id,
	onSuccess,
	onError,
}: { supabase: SupabaseClient<Database>; id: string; onSuccess?: () => void; onError?: () => void }) {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not found");
	}

	const { data, error } = await supabase.from("cvs").delete().eq("id", id);
	if (error) {
		onError?.();
		throw new Error(error.message);
	}

	onSuccess?.();
	return data;
}

export async function updateCVDocument({
	supabase,
	id,
	cv,
}: { supabase: SupabaseClient<Database>; id: string; cv: Partial<ParsedCVProfile> }) {
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

export async function renameCVDocument({
	supabase,
	id,
	name,
	onSuccess,
	onError,
}: {
	supabase: SupabaseClient<Database>;
	id: string;
	name: string;
	onSuccess?: () => void;
	onError?: () => void;
}) {
	const { data, error } = await supabase.from("cvs").update({ title: name }).eq("id", id);
	if (error) {
		onError?.();
		throw new Error(error.message);
	}

	onSuccess?.();
	return data?.[0];
}

export async function createCVDocument({
	supabase,
	cvName = "New CV",
	fromProfile = false,
}: {
	supabase: SupabaseClient<Database>;
	cvName?: string;
	fromProfile?: boolean;
}) {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("User not found");

	let profile: Database["public"]["Tables"]["cv_profiles"]["Row"] | null = null;
	if (fromProfile) {
		const { data } = await supabase.from("cv_profiles").select("*").eq("user_id", user?.id).single();
		profile = data;
		if (!profile) new Error("User not found");
	}

	const { id, created_at, updated_at, user_id, ...profileFields } = profile ?? {};

	const insertFields: Database["public"]["Tables"]["cvs"]["Insert"] = {
		user_id: user.id,
		title: cvName,
		education:
			"education" in profileFields && profileFields.education
				? Array.isArray(profileFields.education)
					? profileFields.education
					: typeof profileFields.education === "string"
						? JSON.parse(profileFields.education)
						: null
				: null,
		experience:
			"experience" in profileFields && profileFields.experience
				? Array.isArray(profileFields.experience)
					? profileFields.experience
					: typeof profileFields.experience === "string"
						? JSON.parse(profileFields.experience)
						: null
				: null,
		projects:
			"projects" in profileFields && profileFields.projects
				? Array.isArray(profileFields.projects)
					? profileFields.projects
					: typeof profileFields.projects === "string"
						? JSON.parse(profileFields.projects)
						: null
				: null,
		skills: "skills" in profileFields ? (profileFields.skills ?? null) : null,
	};

	const { data, error } = await supabase.from("cvs").insert(insertFields).select("id").single();

	if (!data || error) throw new Error(error?.message || "Failed to create CV");

	return data;
}
