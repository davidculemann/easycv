import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "db_types";

export type CVProfileInput = Omit<Database["public"]["Tables"]["cv_profiles"]["Row"], "id" | "user_id">;

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

	return cvData;
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

	return data;
}

export async function updateUserProfile({
	supabase,
	profile,
}: { supabase: SupabaseClient<Database>; profile: CVProfileInput }) {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not found");
	}

	const { created_at, updated_at, id, ...updatableProfile } = profile;

	const { data: existingProfile, error: fetchError } = await supabase
		.from("cv_profiles")
		.select("id")
		.eq("user_id", user.id)
		.single();

	if (fetchError && fetchError.code !== "PGRST116") {
		throw new Error(fetchError.message);
	}

	let error: { message: string } | null = null;

	if (existingProfile) {
		const result = await supabase
			.from("cv_profiles")
			.update(updatableProfile)
			.eq("id", existingProfile.id)
			.eq("user_id", user.id);
		error = result.error;
	} else {
		const result = await supabase.from("cv_profiles").insert({ ...updatableProfile, user_id: user.id });
		error = result.error;
	}

	if (error) {
		throw new Error(error.message);
	}
}
