import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import { type LoaderFunctionArgs, json, redirect } from "@remix-run/node";

export async function action({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect("/login");
	}

	const { data: cvs } = await supabase.from("cvs").insert({
		user_id: user.id,
		title: "New CV",
		content: "",
	});

	return json({ cvs });
}
