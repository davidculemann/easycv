import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "db_types";

export async function getPreferences({ supabase, id }: { supabase: SupabaseClient<Database>; id?: string }) {
	if (!id) {
		throw new Error("User ID is required");
	}

	const { data, error } = await supabase.from("preferences").select("*").eq("user_id", id).single();

	if (error) {
		throw new Error(error.message);
	}

	return data;
}

export async function editPreferences({
	supabase,
	preferences,
	id,
}: {
	supabase: SupabaseClient<Database>;
	preferences: Database["public"]["Tables"]["preferences"]["Update"];
	id?: string;
}) {
	if (!id) {
		throw new Error("User ID is required");
	}

	const { data, error } = await supabase
		.from("preferences")
		.update(preferences)
		.eq("user_id", id)
		.select("*")
		.single();

	if (error) {
		throw new Error(error.message);
	}

	return data;
}
