import { redirect } from "react-router";
import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const validateEnv = () => {
	const required = {
		SUPABASE_URL: process.env.SUPABASE_URL,
		SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
	};

	const missing = Object.entries(required)
		.filter(([, value]) => !value)
		.map(([key]) => key);

	if (missing.length > 0) {
		throw new Error(`Missing required environment variables: ${missing.join(", ")}. Please check your .env file.`);
	}
};

export const getSupabaseEnv = () => {
	validateEnv();
	return {
		SUPABASE_URL: process.env.SUPABASE_URL!,
		SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
	};
};

export function getSupabaseWithHeaders({ request }: { request: Request }) {
	validateEnv();
	const headers = new Headers();

	const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
		cookies: {
			getAll() {
				return parseCookieHeader(request.headers.get("Cookie") ?? "");
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) =>
					headers.append("Set-Cookie", serializeCookieHeader(name, value, options)),
				);
			},
		},
	});

	return { supabase, headers };
}

export async function getSupabaseWithSessionHeaders({ request }: { request: Request }) {
	const { supabase, headers } = getSupabaseWithHeaders({
		request,
	});
	const {
		data: { session },
	} = await supabase.auth.getSession();

	return { session, headers, supabase };
}

export const requireUser = async ({
	supabase,
	headers,
	redirectTo = "/signin",
}: {
	redirectTo?: string;
	supabase: SupabaseClient;
	headers: Headers;
}) => {
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();
	if (!user || error) throw redirect(redirectTo, { headers });

	return user;
};

export const forbidUser = async ({
	supabase,
	headers,
	redirectTo = "/dashboard",
}: {
	supabase: SupabaseClient;
	headers?: Headers;
	redirectTo?: string;
}) => {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) throw redirect(redirectTo, { headers });

	return user;
};
