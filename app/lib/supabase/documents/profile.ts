import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "db_types";

export type CVProfileInput = Omit<Database["public"]["Tables"]["cv_profiles"]["Row"], "id" | "user_id">;

// Helper function to safely parse JSON fields
function parseJsonFields(profile: any) {
	const jsonFields = ["education", "experience", "skills", "projects", "completion"];

	const parsedProfile = { ...profile };

	for (const field of jsonFields) {
		try {
			if (typeof parsedProfile[field] === "string") {
				parsedProfile[field] = JSON.parse(parsedProfile[field]);
			} else if (parsedProfile[field] === null) {
				// Initialize empty values based on expected types
				if (field === "skills" || field === "experience" || field === "projects") {
					parsedProfile[field] = [];
				} else if (field === "completion") {
					parsedProfile[field] = {};
				} else {
					parsedProfile[field] = null;
				}
			}
		} catch (e) {
			console.error(`Error parsing ${field}:`, e);
			// Initialize with empty values on parse error
			if (field === "skills" || field === "experience" || field === "projects") {
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

export async function getUserProfile({ supabase }: { supabase: SupabaseClient<Database> }) {
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

	// Parse JSON fields before returning
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

	// Parse JSON fields before returning
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
		const result = await supabase
			.from("cv_profiles")
			.update(profile)
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
