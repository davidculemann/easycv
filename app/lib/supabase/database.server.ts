import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "db_types";

export function delayAsync(delayMillis: number) {
	return new Promise((resolve) => setTimeout(resolve, delayMillis));
}

export async function getProfileForUsername({
	dbClient,
	username,
}: {
	dbClient: SupabaseClient<Database>;
	username: string;
}) {
	const profileQuery = dbClient.from("profiles").select("*").eq("username", username);

	const { data, error } = await profileQuery;

	if (error) {
		console.log("Error occured during getProfileForUsername : ", error);
	}

	return { data, error };
}
