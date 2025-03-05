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
		.select("*", { count: "exact" })
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
