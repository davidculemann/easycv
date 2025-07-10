import type { LoaderFunctionArgs } from "@remix-run/node";
import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";

export async function action({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const formData = await request.formData();
	const otp = formData.get("otp") as string;
	const email = formData.get("email") as string;

	const { error } = await supabase.auth.verifyOtp({
		token: otp,
		email,
		type: "signup",
	});

	if (error) {
		throw new Response(JSON.stringify({ message: error.message }), { status: 400 });
	}

	return { message: "Success!" };
}
