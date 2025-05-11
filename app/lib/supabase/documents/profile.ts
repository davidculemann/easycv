import type { CVProfileInput, ParsedCVProfile } from "@/components/forms/profile/logic/types";
import { ensureValidProfile } from "@/components/forms/profile/logic/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "db_types";

export function parseJsonFields(profile: any): ParsedCVProfile {
	if (!profile) return ensureValidProfile(null);

	const jsonFields = ["education", "experience", "skills", "projects", "completion"];
	const parsedProfile = { ...profile };

	for (const field of jsonFields) {
		try {
			if (typeof parsedProfile[field] === "string") {
				parsedProfile[field] = JSON.parse(parsedProfile[field]);
			}
		} catch (e) {
			console.error(`Error parsing ${field}:`, e);
			if (field === "skills") {
				parsedProfile[field] = [];
			} else if (field === "experience" || field === "projects" || field === "education") {
				parsedProfile[field] = [];
			} else if (field === "completion") {
				parsedProfile[field] = {};
			} else {
				parsedProfile[field] = null;
			}
		}
	}

	return ensureValidProfile(parsedProfile);
}

export async function getUserProfile({ supabase }: { supabase: SupabaseClient<Database> }): Promise<ParsedCVProfile> {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not found");
	}

	try {
		const { data, error } = await supabase.from("cv_profiles").select("*").eq("user_id", user.id).single();

		if (error) {
			console.warn("Error fetching profile:", error.message);
			return ensureValidProfile(null);
		}

		const { user_id, ...cvData } = data;
		return parseJsonFields(cvData);
	} catch (error) {
		console.error("Error in getUserProfile:", error);
		return ensureValidProfile(null);
	}
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
