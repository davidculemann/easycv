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
}: { supabase: SupabaseClient<Database>; profile: Database["public"]["Tables"]["cv_profiles"]["Row"] }) {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not found");
	}

	const { id, user_id, created_at, ...updatableProfile } = profile;

	const { data, error } = await supabase.from("cv_profiles").update(updatableProfile).eq("user_id", user.id).single();
	if (error) {
		throw new Error(error.message);
	}
}
