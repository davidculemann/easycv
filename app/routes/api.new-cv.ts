import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import type { Database } from "db_types";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return { error: "User not found" };

	const url = new URL(request.url);
	const fromProfile = url.searchParams.get("fromProfile") === "true";
	const cvName = url.searchParams.get("cvName") ?? "New CV";

	let profile: Database["public"]["Tables"]["cv_profiles"]["Row"] | null = null;
	if (fromProfile) {
		const { data } = await supabase.from("cv_profiles").select("*").eq("id", user?.id).single();
		profile = data;
		if (!profile) return { error: "Profile not found" };
	}

	const { id, created_at, updated_at, user_id, ...profileFields } = profile ?? {};

	const { data, error } = await supabase
		.from("cvs")
		.insert({ user_id: user.id, title: cvName, ...(profileFields ?? {}) })
		.select("id")
		.single();

	if (!data || error) return { error: "Failed to create CV" };

	return redirect(`/cvs/${data.id}`);
}
