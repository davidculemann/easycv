import type { EmailOtpType } from "@supabase/supabase-js";
import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const url = new URL(request.url);
	const token_hash = url.searchParams.get("token_hash");
	const type = url.searchParams.get("type") as EmailOtpType | null;
	const redirectUrl = url.searchParams.get("redirectUrl") ?? "/update-password";
	const email = url.searchParams.get("email") ?? "";

	if (token_hash && type) {
		const { supabase, headers } = getSupabaseWithHeaders({ request });

		const { error } = await supabase.auth.verifyOtp({
			type,
			token_hash,
		});

		if (!error) {
			return redirect(`${redirectUrl}?email=${email}`, { headers });
		}
	}

	return redirect("/error");
}
