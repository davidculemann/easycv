import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import { type LoaderFunctionArgs, json, redirect } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect("/login");
	}

	const { data: cvs, error } = await supabase.from("cvs").select("*").eq("user_id", user.id);

	if (error) {
		console.error("Supabase error:", error);
		return json({ error: error.message }, { status: 400 });
	}

	return json({ cvs });
}

export async function action({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect("/login");
	}
	switch (request.method) {
		case "GET": {
			const { data: cvs, error } = await supabase.from("cvs").select("*").eq("user_id", user.id);

			if (error) {
				console.error("Supabase error:", error);
				return json({ error: error.message }, { status: 400 });
			}

			return json({ cvs });
		}
		case "POST": {
			const { data: cvs, error } = await supabase
				.from("cvs")
				.insert([
					{
						user_id: user.id,
						title: "New CV",
					},
				])
				.select()
				.single();

			if (error) {
				console.error("Supabase error:", error);
				return json({ error: error.message }, { status: 400 });
			}

			if (!cvs) {
				return json({ error: "Failed to create CV" }, { status: 400 });
			}

			return json({ cvs });
		}
		case "PUT": {
			/* handle "PUT" */
			return json({ message: "PUT" });
		}
		case "DELETE": {
			/* handle "DELETE" */
			return json({ message: "DELETE" });
		}
	}
}
