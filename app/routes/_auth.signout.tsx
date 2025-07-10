import { type ActionFunctionArgs, redirect } from "react-router";
import { getSupabaseWithHeaders } from "../lib/supabase/supabase.server";

export async function action({ request }: ActionFunctionArgs) {
	const { supabase, headers } = getSupabaseWithHeaders({ request });
	await supabase.auth.signOut();
	return redirect("/signin", { headers });
}

export const loader = () => redirect("/");
