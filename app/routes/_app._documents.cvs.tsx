import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, json, redirect, useLoaderData } from "@remix-run/react";
import { FilePlus } from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect("/login");
	}

	const { data: cvs } = await supabase.from("cvs").select("*").eq("user_id", user.id);

	return json({ cvs });
}

export async function action({ request }: ActionFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect("/login");
	}

	const { data: cvs } = await supabase.from("cvs").insert({
		user_id: user.id,
		title: "New CV",
		content: "",
	});

	return json({ cvs });
}

export default function CVs() {
	const { cvs } = useLoaderData<typeof loader>();
	console.log(cvs);

	return (
		<div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<Form method="post">
				<Button type="submit" asChild variant="outline">
					<Card className="flex flex-col items-center justify-center w-48 h-48">
						<CardHeader>
							<CardTitle>Create New CV</CardTitle>
						</CardHeader>
						<CardContent>
							<FilePlus className="w-18 h-18 " />
						</CardContent>
					</Card>
				</Button>
			</Form>
		</div>
	);
}
