import type { CVProfileInput, ParsedCVProfile } from "@/components/forms/profile/logic/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "db_types";

export function parseJsonFields(profile: any) {
	if (!profile) return null;

	const jsonFields = ["education", "experience", "skills", "projects", "completion"];
	const parsedProfile = { ...profile };

	for (const field of jsonFields) {
		try {
			if (typeof parsedProfile[field] === "string") {
				parsedProfile[field] = JSON.parse(parsedProfile[field]);
			}

			if (parsedProfile[field] === null) {
				if (field === "skills") {
					parsedProfile[field] = [];
				} else if (field === "experience" || field === "projects" || field === "education") {
					parsedProfile[field] = [];
				} else if (field === "completion") {
					parsedProfile[field] = {};
				}
			}

			if (field === "skills" || field === "experience" || field === "projects" || field === "education") {
				if (!Array.isArray(parsedProfile[field]) && parsedProfile[field] !== null) {
					parsedProfile[field] = [parsedProfile[field]];
				}
			}
		} catch (e) {
			console.error(`Error parsing ${field}:`, e);
			if (field === "skills" || field === "experience" || field === "projects" || field === "education") {
				parsedProfile[field] = [];
			} else if (field === "completion") {
				parsedProfile[field] = {};
			} else {
				parsedProfile[field] = null;
			}
		}
	}

	return parsedProfile;
}

export async function getUserProfile({ supabase }: { supabase: SupabaseClient<Database> }): Promise<ParsedCVProfile> {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not found");
	}

	const { data, error } = await supabase.from("cv_profiles").select("*").eq("user_id", user.id).single();
	if (error) {
		throw new Error(error.message);
	}

	const { user_id, ...cvData } = data;

	return parseJsonFields(cvData);
}

export async function createUserProfile({
	supabase,
	profile,
}: {
	supabase: SupabaseClient<Database>;
	profile: CVProfileInput;
}) {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not found");
	}

	const { data, error } = await supabase
		.from("cv_profiles")
		.insert({ ...profile, user_id: user.id })
		.select()
		.single();

	if (error) {
		throw new Error(error.message);
	}

	const { user_id: _, ...cvData } = data;

	return parseJsonFields(cvData);
}

export async function updateUserProfile({
	supabase,
	profile,
}: { supabase: SupabaseClient<Database>; profile: Partial<CVProfileInput> }) {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not found");
	}

	const { data: existingProfile, error: fetchError } = await supabase
		.from("cv_profiles")
		.select("id")
		.eq("user_id", user.id)
		.single();

	let error: { message: string } | null = null;

	if (existingProfile) {
		const { id, ...updateData } = profile as any;

		const result = await supabase
			.from("cv_profiles")
			.update(updateData)
			.eq("id", existingProfile.id)
			.eq("user_id", user.id);

		error = result.error;
	} else {
		const result = await supabase.from("cv_profiles").insert({ ...profile, user_id: user.id });
		error = result.error;
	}

	if (error) {
		throw new Error(error.message);
	}
}
