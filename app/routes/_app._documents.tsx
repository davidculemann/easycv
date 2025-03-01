import type { SupabaseOutletContext } from "@/lib/supabase/supabase";
import { Outlet, useOutletContext } from "@remix-run/react";

export default function Documents() {
	const outletContext = useOutletContext<SupabaseOutletContext>();

	return (
		<div>
			<Outlet context={outletContext} />
		</div>
	);
}
