import type { SupabaseOutletContext } from "@/lib/supabase/supabase";
import { Outlet, useOutletContext } from "@remix-run/react";

export default function Documents() {
	const { supabase, user } = useOutletContext<SupabaseOutletContext>();
	console.log(user);
	return (
		<div>
			<Outlet context={{ supabase, user }} />
		</div>
	);
}
