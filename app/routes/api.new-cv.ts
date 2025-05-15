import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { Database } from "db_types";

export async function action({ request }: ActionFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const formData = await request.formData();
	const fromProfile = formData.get("fromProfile") === "true";
	const cvName = formData.get("cvName") || "New CV";

	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return json({ error: "User not found" }, { status: 401 });

	let profile: Database["public"]["Tables"]["cv_profiles"]["Row"] | null = null;
	if (fromProfile) {
		const { data } = await supabase.from("cv_profiles").select("*").eq("id", user?.id).single();
		profile = data;
		if (!profile) return json({ error: "Profile not found" }, { status: 404 });
	}

	const { id, created_at, updated_at, user_id, ...profileFields } = profile ?? {};

	const { data, error } = await supabase
		.from("cvs")
		.insert({ user_id: user.id, title: cvName, ...(profileFields ?? {}) })
		.select("id")
		.single();

	if (!data || error) return json({ error: "Failed to create CV" }, { status: 500 });

	return redirect(`/cvs/${data.id}`);
}
