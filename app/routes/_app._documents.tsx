import { Outlet, useMatches, useOutletContext } from "@remix-run/react";
import { Container } from "@/components/layout/container";
import type { SupabaseOutletContext } from "@/lib/supabase/supabase";

export default function Documents() {
	const outletContext = useOutletContext<SupabaseOutletContext>();

	const isFullWidth = useMatches().some((match) => match.id === "routes/_app._documents.cvs.$id");

	return (
		<Container fullWidth={isFullWidth}>
			<Outlet context={outletContext} />
		</Container>
	);
}
