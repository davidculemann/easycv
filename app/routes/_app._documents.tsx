import { Outlet, useMatches, useOutletContext } from "react-router";
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
