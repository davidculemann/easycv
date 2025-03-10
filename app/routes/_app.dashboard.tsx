import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const { data: documents } = await supabase.from("cvs").select("*");

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return { user, documents };
}

export default function Dashboard() {
	const user = useLoaderData<typeof loader>();

	return (
		<div className="container h-full pt-8 pb-8 px-4 sm:px-8">
			<h1>Dashboard</h1>
		</div>
	);
}
