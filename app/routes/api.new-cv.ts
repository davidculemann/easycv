import { createCVDocument } from "@/lib/supabase/documents/cvs";
import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });

	const data = await createCVDocument({ supabase });

	if (!data) return { error: "Failed to create CV" };

	return redirect(`/cvs/${data.id}`);
}
