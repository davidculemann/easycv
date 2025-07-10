import { useEffect } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData, useNavigate, useOutletContext } from "react-router";
import { toast } from "sonner";
import AdminPanelLayout from "@/components/layout/admin-panel-layout";
import { ContentLayout } from "@/components/layout/content-layout";
import PageLoading from "@/components/shared/page-loading";
import type { SupabaseOutletContext } from "@/lib/supabase/supabase";
import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import { getLocaleCurrency } from "@/services/stripe/stripe.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase, headers } = getSupabaseWithHeaders({ request });
	const url = new URL(request.url);
	const code = url.searchParams.get("code");

	// If there's a code parameter, we're in an OAuth callback
	if (code) {
		try {
			const { error } = await supabase.auth.exchangeCodeForSession(code);
			if (error) throw error;
			// Redirect to clean URL after successful exchange
			return redirect("/dashboard", { headers });
		} catch (error: any) {
			throw new Response(JSON.stringify({ message: error?.message || "Authentication failed" }), { status: 400 });
		}
	}

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		throw new Response(JSON.stringify({ sessionAvailable: false }), { status: 401 });
	}

	const { data: profile, error: profileError } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", user.id)
		.single();

	if (profileError || !profile) {
		throw new Response(JSON.stringify({ message: profileError?.message || "Could not get profile" }), {
			status: 400,
		});
	}

	const { data: subscription } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).single();
	const currency = getLocaleCurrency(request);

	return { profile, subscription, currency };
}

export default function AuthLayout() {
	const loaderData = useLoaderData<typeof loader>();
	const { supabase, isLoading, user } = useOutletContext<SupabaseOutletContext>();
	const navigate = useNavigate();

	useEffect(() => {
		const checkSession = async () => {
			if ("sessionAvailable" in loaderData && !loaderData.sessionAvailable) {
				const {
					data: { session },
				} = await supabase.auth.getSession();
				if (!session) return navigate("/signin");
			}
			if ("message" in loaderData) {
				toast.error(loaderData.message as string);
				return navigate("/signin");
			}
		};

		checkSession();
	}, [loaderData, supabase, navigate]);

	if (isLoading || !user) {
		return <PageLoading />;
	}

	const { profile, subscription, currency } = loaderData;
	const outletContext = { supabase, profile, subscription, currency, user } as SupabaseOutletContext;

	return (
		<AdminPanelLayout>
			<ContentLayout {...{ subscription }}>
				<Outlet context={outletContext} />
			</ContentLayout>
		</AdminPanelLayout>
	);
}
