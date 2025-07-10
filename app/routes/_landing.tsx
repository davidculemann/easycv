import { Outlet, useOutletContext } from "react-router";
import SiteHeader from "@/components/landing/site-header";
import { Footer } from "@/components/layout/footer";
import type { SupabaseOutletContext } from "@/lib/supabase/supabase";

export default function MarketingLayout() {
	const { supabase } = useOutletContext<SupabaseOutletContext>();
	return (
		<div className="flex min-h-screen flex-col">
			<SiteHeader />
			<Outlet context={{ supabase }} />
			<Footer />
		</div>
	);
}
